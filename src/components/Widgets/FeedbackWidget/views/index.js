import Loadable from '@loadable/component';
import SubmittedView from './SubmittedView';
import SentimentView from './SentimentView';
const CommentView = Loadable(() => import('../views/CommentView'));

export { CommentView, SentimentView, SubmittedView };
