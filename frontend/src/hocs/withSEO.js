import DefaultSEO from '../components/DefaultSEO';

const withSEO = (WrappedComponent, seoProps = {}) => {
    return function WithSEOComponent(props) {
        return (
            <>
            <DefaultSEO/>
                <WrappedComponent {...props} />
            </>
        );
    };
};

export default withSEO;