import Loadable from '@loadable/component';
import RatingView from './RatingView';
import QualifiersView from './QualifiersView';
import SubmittedView from './SubmittedView';
import SupportView from './SupportView';
const CommentView = Loadable(() => import('../views/CommentView'));

export { CommentView, RatingView, QualifiersView, SubmittedView, SupportView };
