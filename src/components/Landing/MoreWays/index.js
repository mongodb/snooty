import { H3 } from '@leafygreen-ui/typography';
import Video from '../../Video';
import ComponentFactory from '../../ComponentFactory';

export const MoreWays = ({ nodeData: { children, options, argument }, ...rest }) => {
  debugger;
  return (
    <div>
      <Video nodeData={{ argument: [{ refuri: options.video_url }] }} />
      <H3>{argument[0]?.value}</H3>
      {children.map((child, i) => (
        <ComponentFactory nodeData={child} key={i} {...rest} />
      ))}
    </div>
  );
};
