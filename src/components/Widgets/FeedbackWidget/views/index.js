<<<<<<< HEAD
import Loadable from '@loadable/component';
import RatingView from './RatingView';
import QualifiersView from './QualifiersView';
=======
import CommentView from './CommentView';
>>>>>>> ec6331a (Delete unused code and email error message red border)
import SubmittedView from './SubmittedView';
import SentimentView from './SentimentView';
const CommentView = Loadable(() => import('../views/CommentView'));

export { CommentView, SentimentView, SubmittedView };
