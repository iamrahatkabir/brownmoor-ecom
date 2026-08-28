import Script from 'next/script'

import { PIXEL_ID } from '@/lib/pixel'

/**
 * Meta Pixel base code.
 *
 * Renders nothing without an id, so local development and any environment that
 * has not been given a pixel simply carry no tracking.
 *
 * The base snippet fires PageView itself. Because the storefront navigates with
 * full page loads rather than client-side routing, this script runs afresh on
 * every page — so there is no route-change listener to maintain, which a
 * single-page app would need.
 */
export function FacebookPixel() {
  if (!PIXEL_ID) {
    return null
  }

  return (
    <>
      <Script id="facebook-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${PIXEL_ID}');
fbq('track','PageView');`}
      </Script>

      {/* Counts visitors whose browser blocks the script. */}
      <noscript>
        {/* A 1x1 beacon inside <noscript>. next/image renders a client
            component and cannot run here, which is the whole point of the
            fallback, so a raw img is the only option. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          height="1"
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          style={{ display: 'none' }}
          width="1"
        />
      </noscript>
    </>
  )
}
