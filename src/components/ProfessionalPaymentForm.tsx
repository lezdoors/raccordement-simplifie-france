import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, CheckCircle2, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Stripe publishable key - safe to expose in frontend
const stripePromise = loadStripe('pk_test_51Q8JZhHsGYOPKJnlBUF7xGf6M9zNJvFo7V2p3nUoOq1e5gfOx1cGnZcyf2nEzJaOPwQ3v7nEzJaOPwQ3v7nEzJaOPwQ3v7nEzJaOPwQ3v7nEzJaOPwQ3v');

interface PaymentFormProps {
  clientSecret: string;
  amount: number;
  description: string;
  onSuccess: () => void;
}

const CheckoutForm: React.FC<PaymentFormProps> = ({ clientSecret, amount, description, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/merci`,
      },
      redirect: 'if_required'
    });

    if (error) {
      console.error('Payment failed:', error);
      toast.error('Erreur de paiement', {
        description: error.message || 'Une erreur est survenue lors du paiement'
      });
    } else {
      toast.success('Paiement réussi !');
      onSuccess();
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
        <PaymentElement 
          options={{
            layout: 'tabs',
            paymentMethodOrder: ['card', 'sepa_debit']
          }}
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={!stripe || isLoading}
        className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 transition-all duration-200"
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <span>Traitement en cours...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <span>Confirmer le paiement</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        )}
      </Button>
    </form>
  );
};

interface ProfessionalPaymentFormProps {
  amount: number;
  description: string;
  formData: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ProfessionalPaymentForm: React.FC<ProfessionalPaymentFormProps> = ({
  amount,
  description,
  formData,
  onSuccess,
  onCancel
}) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  const initializePayment = async () => {
    setIsInitializing(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: { amount, description, formData }
      });

      if (error) throw error;
      
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error('Error initializing payment:', error);
      toast.error('Erreur d\'initialisation', {
        description: 'Impossible d\'initialiser le paiement. Veuillez réessayer.'
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(cents / 100);
  };

  if (!clientSecret) {
    return (
      <Card className="w-full max-w-md mx-auto border-border/50 shadow-xl">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-foreground">
              Finaliser votre demande
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Traitement sécurisé par Stripe
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-muted/30 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">Service</span>
              <span className="text-sm font-medium">{description}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-base font-semibold">Total</span>
              <Badge variant="secondary" className="text-base font-bold px-3 py-1">
                {formatPrice(amount)}
              </Badge>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>Paiement sécurisé SSL 256-bit</span>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={initializePayment}
              disabled={isInitializing}
              className="w-full h-12 text-base font-medium"
            >
              {isInitializing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Préparation...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Procéder au paiement</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onCancel}
              className="w-full"
              disabled={isInitializing}
            >
              Annuler
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <Card className="w-full max-w-md mx-auto border-border/50 shadow-xl">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-foreground">
              Paiement sécurisé
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              {formatPrice(amount)} • {description}
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <CheckoutForm
            clientSecret={clientSecret}
            amount={amount}
            description={description}
            onSuccess={onSuccess}
          />
          
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3 text-green-600" />
              <span>SSL sécurisé</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3 text-green-600" />
              <span>PCI DSS</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3 text-green-600" />
              <span>RGPD</span>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            onClick={onCancel}
            className="w-full text-muted-foreground hover:text-foreground"
            size="sm"
          >
            Retour
          </Button>
        </CardContent>
      </Card>
    </Elements>
  );
};