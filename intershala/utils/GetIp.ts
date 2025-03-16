import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

interface IpifyResponse {
    ip: string;
}

export const getIp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get IP from various sources
        const localIp = req.ip || req.socket.remoteAddress ;
        
        // For local development, try to get the public IP
        let publicIp = '';
        try {
            // Try to get public IP from a service (only in development)
            if (process.env.NODE_ENV !== 'production') {
                const response = await axios.get<IpifyResponse>('https://api.ipify.org?format=json');
                publicIp = response.data.ip;
            }
        } catch (error: any) {
            console.log('Could not fetch public IP:', error);
        }
        
        // Get cookie ID
        const cookie_id = req.cookies['coupon_session'] || '';
        
        // Set a cookie if it doesn't exist
        if (!cookie_id) {
            const newCookieId = Date.now().toString();
            res.cookie('coupon_session', newCookieId, {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
                sameSite: 'strict'
            });
        }
        
        res.json({
            message: 'Coupon Distribution API',
            localIp,
            publicIp: publicIp || 'Not available',
            cookie_id: cookie_id || 'Not set yet',
            note: 'For local development, you will see localhost IPs. In production, you will see real client IPs.'
        });
    } catch (error: any) {
        console.error('Error in getIp:', error);
        res.status(500).json({
            message: 'Error getting IP information',
            error: error.message || 'Unknown error'
        });
    }
};