import { useEffect } from 'react';
import { MaintenancePlaceholder } from './ui/MaintenancePlaceholder';

export default function ExternalRedirect({ url }) {
  useEffect(() => {
    // Keep existing redirect behavior, but show an IELTS maintenance UI briefly
    // so users are not stuck on a blank/unstyled state.
    const t = window.setTimeout(() => {
      window.location.href = url;
    }, 800);

    return () => window.clearTimeout(t);
  }, [url]);

  return (
    <MaintenancePlaceholder
      title="Tính năng đang được phát triển"
      message="Chúng tôi đang hoàn thiện trải nghiệm Grammar. Vui lòng chờ trong giây lát..."
      fullPage
    />
  );
}
