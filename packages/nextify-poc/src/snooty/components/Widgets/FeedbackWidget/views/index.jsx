import Loadable from '@loadable/component';
import SubmittedView from './SubmittedView';
import RatingView from './RatingView';
const CommentView = Loadable(() => import('../views/CommentView'));

export { CommentView, RatingView, SubmittedView };
