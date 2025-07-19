import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

enum Plan {
  Free = 'Free',
  Pro = 'Pro',
  Enterprise = 'Enterprise',
}

const plans = [
  {
    name: Plan.Free,
    price: '$0',
    priceDetails: '/month',
    features: ['Up to 1 thumbnail analysis', 'Basic AI feedback', 'Community support'],
    cta: 'Get Started',
  },
  {
    name: Plan.Pro,
    price: '$29',
    priceDetails: '/month',
    features: [
      'Unlimited thumbnail ranking',
      'Advanced AI-powered explanations',
      'Priority email support',
      'Performance tracking',
    ],
    cta: 'Upgrade to Pro',
    popular: true,
  },
  {
    name: Plan.Enterprise,
    price: 'Custom',
    priceDetails: '',
    features: [
      'Everything in Pro',
      'Team accounts',
      'Dedicated account manager',
      'API access',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
  },
];

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
          Choose Your Plan
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Start for free, and scale up as you grow. No credit card required.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={cn('flex flex-col', {
              'border-primary shadow-primary/20 shadow-lg': plan.popular,
            })}
          >
            <CardHeader className="relative">
              {plan.popular && (
                <div className="absolute top-0 right-6 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.priceDetails}</CardDescription>
              <div className="text-4xl font-bold">
                {plan.price}
                <span className="text-lg font-normal text-muted-foreground">{plan.priceDetails && ` ${plan.priceDetails}`}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="w-5 h-5 text-accent mr-3 mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                size="lg"
                className="w-full"
                variant={plan.popular ? 'default' : 'outline'}
              >
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
