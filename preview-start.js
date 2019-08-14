import React from 'react';
import ReactDOM from 'react-dom';
import { getPageData } from './preview/preview-setup';
import Guide from './src/templates/guide';

class Preview extends React.Component {
    constructor(props) {
        super(props);
        this.beepboop = "beepboop";
        this.state = {
            pageData: null
        }
    }

    componentDidMount() {
        getPageData(process.env.PREVIEW_PAGE).then((pageData) => {
            this.setState({pageData})
        });
    }

    render() {
        const { pageData } = this.state;
        console.log(pageData);

        if (pageData) {
            const pageContext = pageData.context;
            const path = pageData.path;

            console.log(pageContext);
            console.log(path);
        }

        return(
            <div>
                {pageData && 
                    <Guide pageContext={pageData.context} path={pageData.path} />
                }
            </div>
        );
    }
}

ReactDOM.render(
    <Preview/>, 
    document.getElementById('app')
);