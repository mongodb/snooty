import Loadable from '@loadable/component';
import RatingView from './RatingView';
import QualifiersView from './QualifiersView';
import SubmittedView from './SubmittedView';
import SupportView from './SupportView';
import SentimentView from './SentimentView';
const CommentView = Loadable(() => import('../views/CommentView'));

export { CommentView, RatingView, SentimentView, QualifiersView, SubmittedView, SupportView };
