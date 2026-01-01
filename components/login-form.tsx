'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787/api/v1'
        }/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Login failed');
      }

      // Store token and user data
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data.user));

      toast.success('Login successful!');

      // Redirect to dashboard or home
      router.push('/');
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'An error occurred during login'
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0 shadow-xl border-none">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={onSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center mb-4">
                <h1 className="text-3xl font-black tracking-tighter text-primary">
                  HARVY ERP
                </h1>
                <p className="text-muted-foreground text-balance text-sm font-medium">
                  Integrated Management System of Business Processes
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  required
                  disabled={isLoading}
                  className="bg-muted/50"
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  disabled={isLoading}
                  className="bg-muted/50"
                />
              </Field>
              <Field>
                <Button
                  type="submit"
                  className="w-full font-bold h-11"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    'Login to Harvy ERP'
                  )}
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card py-2">
                Or continue with
              </FieldSeparator>
              <FieldDescription className="text-center text-sm">
                Lost access to your account?{' '}
                <a href="#" className="underline underline-offset-4">
                  Contact HR
                </a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              src="/palm-field.png"
              alt="Image"
              fill
              className="absolute inset-0 object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center text-xs">
        HAVYS OIL MILL SDN. BHD.
        <br />
        No. B-6-1, Tower B, BBT One, Lebuh Batu Nilam 1, Bandar Bukit Tinggi,
        41200 Klang, Selangor Darul Ehsan.
      </FieldDescription>
    </div>
  );
}
