import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// import { jwt } from '../../utils';

    export async function middleware ( req: NextRequest, ev: NextFetchEvent ) {
        
        const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        // console.log({ session });

        if ( !session ) {   
            const url = req.nextUrl.clone();
            url.pathname='/auth/login';
            url.search = `?p=${ req.page.name }`;
            return NextResponse.redirect(url);
        }

        return NextResponse.next();

        // NO UTILIZADO POR COOKIES[TOKENS], SIN NEXT-AUTH
        // const { token = '' } = req.cookies;        
        // // return new Response('No autorizado', { status: 401 });
        
        // try {

        //     await jwt.isValidToken( token );
        //     return NextResponse.next();

        // } catch ( err ) {
            
        //     const url = req.nextUrl.clone();
        //     url.pathname='/auth/login';
        //     url.search = `?p=${ req.page.name }`;

        //     return NextResponse.redirect(url);
        // }

    }