import { Maintenance } from '@/app/(frontend)/page'
import { ProfileHeader } from '@/components/profile/profile-header'

export default function DiscussionPage() {
  return (
    <div className="h-full w-full">
      <ProfileHeader title="Discussion" />
      <Maintenance message="User discussion list page is still in design" />
    </div>
  )
}
