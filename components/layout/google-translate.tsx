"use client";

import * as React from "react";
import Script from "next/script";

export function GoogleTranslate() {
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const html = document.documentElement;
    const saved = localStorage.getItem("profitbook.lang");

    if (saved === "bn") {
      html.setAttribute("lang", "bn");
      html.classList.add("translated-bn");
    }

    const observer = new MutationObserver(() => {
      const gt = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
      if (gt) {
        if (gt.value === "bn") {
          html.setAttribute("lang", "bn");
          html.classList.add("translated-bn");
        } else {
          html.setAttribute("lang", "en");
          html.classList.remove("translated-bn");
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div id="google_translate_element" className="hidden" aria-hidden />

      <Script id="gt-init" strategy="beforeInteractive">
        {`
          (function() {
            try {
              var saved = localStorage.getItem('profitbook.lang');
              if (saved === 'bn') {
                document.documentElement.setAttribute('lang', 'bn');
                document.documentElement.classList.add('translated-bn');
                var cookie = '/en/bn';
                document.cookie = 'googtrans=' + cookie + ';path=/';
                document.cookie = 'googtrans=' + cookie + ';path=/;domain=' + location.hostname;
              }
            } catch (e) {}
          })();
        `}
      </Script>

      <Script id="gt-loader" strategy="afterInteractive">
        {`
          function googleTranslateElementInit() {
            new google.translate.TranslateElement({
              pageLanguage: 'en',
              includedLanguages: 'en,bn',
              autoDisplay: false,
              layout: google.translate.TranslateElement.InlineLayout.SIMPLE
            }, 'google_translate_element');
          }
        `}
      </Script>
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </>
  );
}