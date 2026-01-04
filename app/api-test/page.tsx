import { ApiTest } from '@/components/ApiTest';

export default function ApiTestPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">AYTS API Integration Test</h1>
        <ApiTest />
      </div>
    </div>
  );
}
