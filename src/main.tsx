import ReactDOM from 'react-dom/client';
import { App } from './app';
import { AppProvider } from './providers/AppProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<AppProvider>
		<App />
	</AppProvider>
);
