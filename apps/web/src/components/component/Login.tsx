import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import Link from 'next/link';

export function LoginForm() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-shrink-0 items-center space-x-2 p-5">
        <Star /> {/* Remplacez Star par votre composant icône réel */}
        <span className="text-xl font-bold uppercase">Superstar</span>
      </div>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Connexion</CardTitle>
          <CardDescription>
            Entrez votre nom d'utilisateur ci-dessous pour vous connecter à votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <Input id="username" type="text" placeholder="nom d'utilisateur" required />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Mot de passe</Label>
              </div>
              <Input id="password" type="password" placeholder="mot de passe" required />
            </div>
            <Link href="/">
              <Button type="submit" className="w-full">
                Connexion
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
