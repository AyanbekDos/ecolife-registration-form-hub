import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { Info, AlertTriangle } from 'lucide-react';
import { handleFormSubmission } from '@/api/formHandler';

interface RegistrationFormProps {
  translations: {
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
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ translations }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    country: '',
    company: '',
    industry: '',
    email: '',
    phone: '',
    hasCertificate: false,
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, hasCertificate: checked }));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {

      // Form validation
      if (!formData.country || !formData.company || !formData.industry || !formData.email) {
        toast({
          title: translations.errorMessage,
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast({
          title: translations.errorMessage,
          description: "Please enter a valid email address.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      const result = await handleFormSubmission({
        ...formData
      });

      if (result.success) {
        toast({
          title: "Успех!",
          description: translations.successMessage,
        });
        
        // Сбрасываем форму
        setFormData({
          country: '',
          company: '',
          industry: '',
          email: '',
          phone: '',
          hasCertificate: false,
          description: ''
        });
      } else {
        throw new Error(result.message || 'Ошибка при отправке формы');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error instanceof Error ? error.message : translations.errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="registration" className="py-12 md:py-20 bg-ecogreen">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl mx-auto">
          <div className="p-5 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-ecogreen mb-2">{translations.title}</h2>
            <p className="text-gray-600 mb-4 md:mb-6">{translations.subtitle}</p>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm md:text-base text-yellow-700 font-medium">{translations.warning.title}</p>
                  <p className="text-sm text-yellow-700">{translations.warning.description}</p>
                  <ul className="list-disc pl-5 mt-1 text-xs md:text-sm text-yellow-700">
                    {translations.warning.steps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg md:text-xl font-semibold mb-4">{translations.formTitle}</h3>
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                      {translations.fields.country} *
                    </label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                      {translations.fields.company} *
                    </label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                      {translations.fields.industry} *
                    </label>
                    <Input
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="w-full"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      {translations.fields.email} *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      {translations.fields.phone}
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 md:mb-4">
                      {translations.fields.hasCertificate}
                    </label>
                    <div className="flex space-x-4">
                      <div className="flex items-center">
                        <Checkbox
                          id="hasCertificate"
                          checked={formData.hasCertificate}
                          onCheckedChange={handleCheckboxChange}
                        />
                        <label
                          htmlFor="hasCertificate"
                          className="ml-2 text-sm text-gray-700"
                        >
                          {translations.fields.yes}
                        </label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox
                          id="noCertificate"
                          checked={!formData.hasCertificate}
                          onCheckedChange={(checked) => handleCheckboxChange(!checked)}
                        />
                        <label
                          htmlFor="noCertificate"
                          className="ml-2 text-sm text-gray-700"
                        >
                          {translations.fields.no}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    {translations.fields.description}
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
                
                <div className="flex justify-center pt-4">
                  <Button
                    type="submit"
                    className="bg-ecogold hover:bg-ecogold-light text-ecogreen px-6 py-5 md:px-8 md:py-6 text-base md:text-lg font-medium w-full md:w-auto mt-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Жіберілуде...' : translations.submitButton}
                  </Button>
                </div>
              </form>
              
              <p className="text-center text-sm mt-6 text-gray-600">
                {translations.afterSubmit}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistrationForm;
