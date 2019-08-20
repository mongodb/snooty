import React from 'react';
import ReactDOM from 'react-dom';
import { Helmet } from 'react-helmet';
import { getPageData } from './preview/preview-setup';
import Document from './src/templates/document';
import Guide from './src/templates/guide';
import Index from './src/templates/guides-index';
import DefaultLayout from './src/components/layout';

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
            <React.Fragment>
                <Helmet>
                    {process.env.GATSBY_SITE === 'guides' ? (
                        <link rel="stylesheet" href='./public/docs-tools/guides.css' type="text/css" />
                    ) : (
                        <link rel="stylesheet" href='./public/docs-tools/mongodb-docs.css' type="text/css" />
                    )}
                </Helmet>
                {pageData && 
                <DefaultLayout pageContext={pageData.context} path={pageData.path}>
                    {template}
                </DefaultLayout>}
            </React.Fragment>
        );
    }
}

ReactDOM.render(
    <Preview/>, 
document.getElementById('app') // Found in index.html
);