// Supports weights 100-900
import "@fontsource-variable/labrada";

import { Suspense, useCallback } from "react";
import { Theme } from "react-daisyui";

import { PreferenceContext, PreferenceProvider } from "@/services/context";
import { Theme as PrefTheme } from "@/services/preference/preference";
import { Router } from "@/services/router";

export function App() {
  const mapThemeToDaisyTheme = useCallback((theme: PrefTheme) => {
    switch (theme) {
      case PrefTheme.black:
        return "black";
      case PrefTheme.light:
        return "lofi";
    }
  }, []);

  return (
    <Suspense fallback={<div>loading</div>}>
      <PreferenceProvider>
        <PreferenceContext.Consumer>
          {({ preference }) => (
            <Theme dataTheme={mapThemeToDaisyTheme(preference.theme)} className="font-serif">
              <Router />
            </Theme>
          )}
        </PreferenceContext.Consumer>
      </PreferenceProvider>
    </Suspense>
  );
}
