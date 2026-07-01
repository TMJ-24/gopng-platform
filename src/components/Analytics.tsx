'use client'

import Script from 'next/script'

/**
 * Injects third-party analytics scripts.
 * Configure each provider via environment variables — set only the IDs you need.
 * Scripts are deferred with strategy="afterInteractive" so they never block paint.
 */
export function Analytics() {
  const clarityId    = process.env.NEXT_PUBLIC_CLARITY_ID
  const gaId         = process.env.NEXT_PUBLIC_GA_ID
  const linkedinId   = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID
  const snowplowUrl  = process.env.NEXT_PUBLIC_SNOWPLOW_COLLECTOR

  if (!clarityId && !gaId && !linkedinId && !snowplowUrl) return null

  return (
    <>
      {/* ── Microsoft Clarity ──────────────────────────────────────── */}
      {clarityId && (
        <Script id="ms-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window,document,"clarity","script","${clarityId}");`}
        </Script>
      )}

      {/* ── Google Analytics 4 ─────────────────────────────────────── */}
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];
            function gtag(){dataLayer.push(arguments);}
            gtag('js',new Date());
            gtag('config','${gaId}',{page_path:window.location.pathname});`}
          </Script>
        </>
      )}

      {/* ── LinkedIn Insight Tag ────────────────────────────────────── */}
      {linkedinId && (
        <Script id="linkedin-insight" strategy="afterInteractive">
          {`_linkedin_partner_id="${linkedinId}";
          window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];
          window._linkedin_data_partner_ids.push(_linkedin_partner_id);
          (function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};
          window.lintrk.q=[]}var s=document.getElementsByTagName("script")[0];
          var b=document.createElement("script");b.type="text/javascript";b.async=true;
          b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";
          s.parentNode.insertBefore(b,s);})(window.lintrk);`}
        </Script>
      )}

      {/* ── Snowplow Analytics ─────────────────────────────────────── */}
      {snowplowUrl && (
        <Script id="snowplow" strategy="afterInteractive">
          {`;(function(p,l,o,w,i,n,g){if(!p[i]){p.GlobalSnowplowNamespace=p.GlobalSnowplowNamespace||[];
          p.GlobalSnowplowNamespace.push(i);p[i]=function(){(p[i].q=p[i].q||[]).push(arguments)};
          p[i].q=p[i].q||[];n=l.createElement(o);g=l.getElementsByTagName(o)[0];n.async=1;
          n.src=w;g.parentNode.insertBefore(n,g)}}(window,document,"script","//cdn.jsdelivr.net/npm/@snowplow/javascript-tracker/dist/sp.js","snowplow"));
          snowplow("newTracker","sp","${snowplowUrl}",{appId:"gopng-web"});
          snowplow("trackPageView");`}
        </Script>
      )}
    </>
  )
}
