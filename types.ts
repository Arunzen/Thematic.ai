
export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  card: string;
}

export interface WebSection {
  heading: string;
  content: string;
  icon?: string;
}

export interface WebPage {
  title: string;
  heroTitle: string;
  heroSubtitle: string;
  sections: WebSection[];
}

export interface WebsiteTheme {
  businessName: string;
  industry: string;
  aesthetic: string;
  colors: ColorPalette;
  typography: {
    headingFont: string;
    bodyFont: string;
  };
  pages: {
    home: WebPage;
    about: WebPage;
    services: WebPage;
    contact: WebPage;
  };
  imagePrompts: {
    hero: string;
    feature: string;
  };
}

export interface GeneratedThemeState {
  data: WebsiteTheme | null;
  heroImageUrl: string | null;
  loading: boolean;
  error: string | null;
}
