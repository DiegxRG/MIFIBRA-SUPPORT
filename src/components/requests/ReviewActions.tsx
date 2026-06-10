import { useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import type { AccessRequestRead, RequestRejectionAction } from '@/types/api';

interface Props {
  request: AccessRequestRead;
  onApprove: (comment: string) => Promise<void>;
  onReject: (comment: string, action: RequestRejectionAction) => Promise<void>;
  loading?: boolean;
}

export default function ReviewActions({ request, onApprove, onReject, loading }: Props) {
  const [showConfirm, setShowConfirm] = useState<'approve' | 'reject' | null>(null);
  const [comment, setComment] = useState('');

  if (request.status !== 'PENDING') return null;

  const handleConfirm = async () => {
    if (showConfirm === 'approve') {
      await onApprove(comment);
    } else if (showConfirm === 'reject') {
      await onReject(comment, 'REJECT_ONLY');
    }
    setShowConfirm(null);
    setComment('');
  };

  return (
    <div className="glass-card p-5 space-y-4">
      <h3 className="text-sm font-semibold text-text-primary">Review Request</h3>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Review comment (optional)"
        rows={2}
        className="input-base resize-none"
      />

      {showConfirm && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-light border border-border-subtle">
          <AlertTriangle size={18} className="text-status-pending shrink-0" />
          <p className="text-xs text-text-secondary flex-1">
            {showConfirm === 'approve'
              ? 'This will grant access and create a firewall rule.'
              : 'This will reject the request without adding it to the blacklist.'}
          </p>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="btn-primary !px-3 !py-1.5 !text-xs"
          >
            {loading ? <Loader2 className="animate-spin" size={14} /> : 'Confirm'}
          </button>
          <button
            onClick={() => setShowConfirm(null)}
            className="btn-ghost !px-3 !py-1.5 !text-xs"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => setShowConfirm('approve')}
          disabled={loading}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          <CheckCircle2 size={18} />
          Approve
        </button>
        <button
          onClick={() => setShowConfirm('reject')}
          disabled={loading}
          className="btn-danger flex-1 flex items-center justify-center gap-2"
        >
          <XCircle size={18} />
          Reject
        </button>
      </div>
    </div>
  );
}
