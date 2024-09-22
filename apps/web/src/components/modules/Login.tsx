'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { login, selectAuth } from '@/services/authSlice';
import { useAppDispatch, useAppSelector } from '@/services/hooks';
import { Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function LoginForm() {
  const router = useRouter(); // useRouter hook from Next.js for navigation
  const { setAuthenticated } = useAuth(); // useAuth hook to get setAuthenticated function

  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(selectAuth);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(login({ username, password }));
    setAuthenticated(true);
    router.push('/'); // Redirect to mailing page
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-shrink-0 items-center space-x-2 p-5">
        <Star />
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
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="nom d'utilisateur"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Mot de passe</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Connexion...' : 'Connexion'}
              </Button>
              {error && <p className="text-red-500">{error}</p>}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
