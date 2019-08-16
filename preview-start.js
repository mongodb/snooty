import React from 'react';
import ReactDOM from 'react-dom';
import { getPageData } from './preview/preview-setup';
import Document from './src/templates/document';
import Guide from './src/templates/guide';
import Index from './src/templates/guides-index';

class Preview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageData: null,
            template: null
        }
    }

    componentDidMount() {
        getPageData(process.env.PREVIEW_PAGE).then((pageData) => {
            let templateComponent;
            if (pageData.template === 'guide') {
                templateComponent = <Guide pageContext={pageData.context} path={pageData.path}/>
            }
            else if (pageData.template === 'guides-index') {
                templateComponent = <Index pageContext={pageData.context}/>
            }
            else {
                templateComponent = <Document pageContext={pageData.context}/>
            }
            this.setState({
                pageData, 
                template: templateComponent
            });
        });
    }

    render() {
        const { pageData, template } = this.state;

        return(
            <div>
                {pageData && template}
            </div>
        );
    }
}

ReactDOM.render(
    <Preview/>, 
    document.getElementById('app')
);