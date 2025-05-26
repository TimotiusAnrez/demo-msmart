import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'
import type { User } from '@/payload-types'

interface ProfileViewProps {
  user: User
}

export function ProfileView({ user }: ProfileViewProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'DECLINED':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'VERIFICATION_REQUEST':
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'bg-green-100 text-green-800'
      case 'DECLINED':
        return 'bg-red-100 text-red-800'
      case 'VERIFICATION_REQUEST':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">First Name</label>
              <p className="text-sm">{user.information.firstName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Last Name</label>
              <p className="text-sm">{user.information.lastName}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Gender</label>
              <p className="text-sm capitalize">{user.information.gender}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
              <p className="text-sm">{new Date(user.information.DOB).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Legal Document
            <div className="flex items-center gap-1">
              {getStatusIcon(user.verification.status)}
              <Badge className={getStatusColor(user.verification.status)}>
                {user.verification.status.replace('_', ' ')}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Document Type</label>
              <p className="text-sm">
                {user.verification.documentType === 'PASSPORT' ? 'Passport' : 'ID Card'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Document Number</label>
              <p className="text-sm">{user.verification.documentNumber}</p>
            </div>
          </div>
          {user.verification.status === 'DECLINED' &&
            user.verification.rejectReason?.description && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">
                  <strong>Rejection Reason:</strong> {user.verification.rejectReason.description}
                </p>
              </div>
            )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <div className="flex items-center gap-2">
              <p className="text-sm">{user.contact.email.handler}</p>
              {user.contact.email.isVerified ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
            <div className="flex items-center gap-2">
              <p className="text-sm">{user.contact.phone?.number || 'Not provided'}</p>
              {user.contact.phone?.number &&
                (user.contact.phone.isVerified ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
