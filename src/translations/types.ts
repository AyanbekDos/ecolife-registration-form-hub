export interface Translations {
  navbar: {
    home: string;
    about: string;
    benefits: string;
    register: string;
  };
  hero: {
    title: string;
    subtitle: string;
    description: string;
    registerButton: string;
  };
  about: {
    title: string;
    mission: string;
    missionTitle: string;
    description: string;
    features: {
      international: {
        title: string;
        description: string;
      };
      certified: {
        title: string;
        description: string;
      };
      official: {
        title: string;
        description: string;
      };
    };
  };
  benefits: {
    title: string;
    benefits: {
      title: string;
      description: string;
    }[];
    whyRegisterTitle: string;
  };
  registration: {
    title: string;
    subtitle: string;
    fields: {
      country: string;
      company: string;
      industry: string;
      email: string;
      phone: string;
      hasCertificate: string;
      yes: string;
      no: string;
      description: string;
    };
    submitButton: string;
    successMessage: string;
    errorMessage: string;
    warning: {
      title: string;
      description: string;
      steps: string[];
    };
    formTitle: string;
    afterSubmit: string;
  };
  footer: {
    contact: string;
    email: string;
    location: string;
    copyright: string;
  };
}
