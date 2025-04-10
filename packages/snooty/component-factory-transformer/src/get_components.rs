use std::collections::HashSet;

use swc_core::ecma::{
    ast::{Expr, Ident, ObjectLit, Prop, PropName, PropOrSpread},
    visit::{as_folder, VisitMut},
};
use swc_ecma_parser::{EsConfig, Syntax};
use swc_ecma_transforms_testing::{test, test_inline};

#[derive(Clone)]
pub struct GetComponentNamesTransform {
    pub includes: HashSet<String>,
    pub component_names: HashSet<String>,
}

/**
 * This transformer retrieves the imported component name to determine which imports to remove.
 * This is needed to be done because the name of the imports don't match with the name of the directive itself.
 * For example, the `blockquote` directive does not match exactly the name of the default import for it, or for the
 * file that is being imported (`import BlockQuote from './BlockQuote';`). Because of this, we need to get the correct
 * imported component name, and then use that in the root transformer to perform the filtering process.
 */
impl VisitMut for GetComponentNamesTransform {
    fn visit_mut_object_lit(&mut self, n: &mut ObjectLit) {
        for prop in n.props.iter() {
            match prop {
                PropOrSpread::Prop(p) => {
                    let property = *p.to_owned();
                    match property {
                        Prop::KeyValue(key_value) => {
                            let key = key_value.key;
                            let value = *key_value.value;

                            match key {
                                PropName::Str(key_str) => {
                                    if self.includes.contains(key_str.value.as_str()) {
                                        match value {
                                            Expr::Ident(v_ident) => {
                                                self.component_names
                                                    .insert(v_ident.sym.as_str().to_string());
                                            }
                                            _ => {}
                                        }
                                    }
                                }
                                PropName::Ident(key_ident) => {
                                    if self.includes.contains(key_ident.sym.as_str()) {
                                        match value {
                                            Expr::Ident(v_ident) => {
                                                self.component_names
                                                    .insert(v_ident.sym.as_str().to_string());
                                            }
                                            _ => {}
                                        }
                                    }
                                }
                                _ => {}
                            }
                        }
                        _ => {}
                    }
                }
                _ => {}
            }
        }
    }
}

test_inline!(
    Syntax::Es(EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| as_folder(GetComponentNamesTransform {
        includes: HashSet::from_iter(
            vec!["banner".to_string(), "blockquote".to_string()]
                .iter()
                .cloned()
        ),
        component_names: HashSet::from_iter(vec![].iter().cloned())
    }),
    get_map,
    // Input codes
    r#"
    import Admonition, { admonitionMap } from './Admonition';
    import Banner from './Banner/Banner';
    import BlockQuote from './BlockQuote';

    const roleMap = {
        'highlight-blue': RoleHighlight,
        'highlight-green': RoleHighlight,
        'highlight-red': RoleHighlight,
        'highlight-yellow': RoleHighlight,
        'icon-fa5': RoleIcon,
        'icon-fa5-brands': RoleIcon,
        'icon-fa4': RoleIcon,
        'icon-mms': RoleIcon,
        'icon-charts': RoleIcon,
        'icon-lg': RoleIcon,
    };

    export const componentMap = {
        admonition: Admonition,
        banner: Banner,
        blockquote: BlockQuote,
    };
    "#,
    // Output codes after transformed with plugin
    r#"
    import Admonition, { admonitionMap } from './Admonition';
    import Banner from './Banner/Banner';
    import BlockQuote from './BlockQuote';
    
    const roleMap = {
        'highlight-blue': RoleHighlight,
        'highlight-green': RoleHighlight,
        'highlight-red': RoleHighlight,
        'highlight-yellow': RoleHighlight,
        'icon-fa5': RoleIcon,
        'icon-fa5-brands': RoleIcon,
        'icon-fa4': RoleIcon,
        'icon-mms': RoleIcon,
        'icon-charts': RoleIcon,
        'icon-lg': RoleIcon,
    };
    
    export const componentMap = {
        admonition: Admonition,
        banner: Banner,
        blockquote: BlockQuote,
    };
    "#
);
