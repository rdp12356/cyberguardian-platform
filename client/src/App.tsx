import { QueryClientProvider } from '@tanstack/react-query';
import { Router, Route, Switch } from 'wouter';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { Tools } from '@/pages/Tools';
import { Threats } from '@/pages/Threats';
import { Analytics } from '@/pages/Analytics';
import { Glossary } from '@/pages/Glossary';
import { queryClient } from '@/lib/queryClient';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/tools" component={Tools} />
            <Route path="/threats" component={Threats} />
            <Route path="/analytics" component={Analytics} />
            <Route path="/glossary" component={Glossary} />
            <Route>
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Page Not Found
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  The page you're looking for doesn't exist.
                </p>
              </div>
            </Route>
          </Switch>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}