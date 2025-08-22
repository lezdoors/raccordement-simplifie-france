
import { EnhancedTimelineTab } from './EnhancedTimelineTab';

interface TimelineTabProps {
  leadId: string;
}

export const TimelineTab = ({ leadId }: TimelineTabProps) => {
  return <EnhancedTimelineTab leadId={leadId} />;
};
