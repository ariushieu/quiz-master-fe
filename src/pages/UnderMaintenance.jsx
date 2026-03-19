import { MaintenancePlaceholder } from '../components/ui/MaintenancePlaceholder';

export default function UnderMaintenance({ feature = 'This feature' }) {
  return (
    <MaintenancePlaceholder
      title={`${feature} đang được phát triển`}
      message="Chúng tôi đang hoàn thiện tính năng này để mang lại trải nghiệm tốt hơn. Vui lòng quay lại sau."
      fullPage
    />
  );
}
