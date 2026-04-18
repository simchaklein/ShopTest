import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ProductIndex() {
  const router = useRouter();

  useEffect(() => {
    router.push('/');
  }, [router]);

  return <div>Redirecting...</div>;
}
