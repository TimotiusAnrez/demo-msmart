import { format } from 'date-fns'
import { MessageSquare, User, AlertTriangle } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DiscussionComment, User as UserType } from '@/payload-types'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface CommentListProps {
  comments: any[] // Using any[] because the type from Discussion.commentList.docs is complex
}

export function CommentList({ comments = [] }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <MessageSquare className="mx-auto h-8 w-8 opacity-50" />
        <p className="mt-2">No comments yet. Be the first to comment!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  )
}

interface CommentProps {
  comment: DiscussionComment
}

function Comment({ comment }: CommentProps) {
  const { commenter, content, createdAt, isReported, archived } = comment
  const commenterData = commenter as UserType
  const publishDate = new Date(createdAt)
  const formattedDate = format(publishDate, "MMM d, yyyy 'at' h:mm a")

  // Display a placeholder message for archived or reported comments
  if (archived || isReported) {
    return (
      <div className="rounded-lg border bg-card/50 p-4 opacity-75">
        <Alert variant="default" className="bg-muted/50 border-muted">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {archived
              ? 'This comment has been deleted by a moderator.'
              : 'This comment has been reported and is under review.'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm transition-colors hover:bg-accent/5">
      <div className="flex items-start gap-3">
        {/* Commenter Avatar */}
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>

        {/* Comment Content */}
        <div className="flex-1 space-y-1.5">
          {/* Commenter Name & Date */}
          <div className="flex items-center text-sm">
            <p className="font-medium">{commenterData?.fullName || 'Anonymous User'}</p>
            <span className="mx-1.5 h-1 w-1 rounded-full bg-muted-foreground/30" />
            <time className="text-xs text-muted-foreground" dateTime={publishDate.toISOString()}>
              {formattedDate}
            </time>
          </div>

          {/* Comment Text */}
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap text-sm">{content}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
