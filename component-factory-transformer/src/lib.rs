use serde::Deserialize;
use std::collections::HashSet;
use swc_core::ecma::{
    ast::*,
    transforms::testing::test_inline,
    visit::{as_folder, FoldWith, VisitMut, VisitMutWith},
};
use swc_ecma_parser::{EsConfig, Syntax};

use swc_core::plugin::{plugin_transform, proxies::TransformPluginProgramMetadata};

pub struct TransformVisitor {
    exclude: HashSet<String>,
}

impl VisitMut for TransformVisitor {
    // Implement necessary visit_mut_* methods for actual custom transform.
    // A comprehensive list of possible visitor methods can be found here:
    // https://rustdoc.swc.rs/swc_ecma_visit/trait.VisitMut.html
    fn visit_mut_module_items(&mut self, n: &mut std::vec::Vec<ModuleItem>) {
        n.visit_mut_children_with(self);

        n.retain(|item| match item {
            ModuleItem::ModuleDecl(module_decl) => match module_decl {
                ModuleDecl::Import(import) => {
                    for spec in import.specifiers.iter() {
                        match spec {
                            ImportSpecifier::Default(default) => {
                                let component_name = default.local.sym.as_str();

                                if self.exclude.contains(component_name) {
                                    return false;
                                }
                            }
                            _ => {}
                        }
                    }
                    true
                }
                _ => true,
            },
            _ => true,
        });
    }

    fn visit_mut_object_lit(&mut self, n: &mut ObjectLit) {
        n.props.retain(|prop| match prop {
            PropOrSpread::Prop(p) => {
                let property = *p.to_owned();
                match property {
                    Prop::KeyValue(key_value) => {
                        let value = *key_value.value;
                        match value {
                            Expr::Ident(value_ident) => {
                                let component_name = value_ident.sym.as_str();
                                !self.exclude.contains(component_name)
                            }
                            _ => true,
                        }
                    }
                    _ => true,
                }
            }
            _ => true,
        })
    }
}

#[derive(Clone, Debug, Deserialize)]
pub struct Config {
    #[serde(default)]
    pub exclude: Vec<String>,
}

#[plugin_transform]
pub fn process_transform(program: Program, metadata: TransformPluginProgramMetadata) -> Program {
    let config_str = metadata
        .get_transform_plugin_config()
        .expect("Failed to retrieve plugin config for remove-unused-directives");

    let config: Config = serde_json::from_str::<Option<Config>>(&config_str)
        .expect("")
        .unwrap_or_else(|| Config { exclude: vec![] });

    let exclude_set = HashSet::from_iter(config.exclude.iter().cloned());
    program.fold_with(&mut as_folder(TransformVisitor {
        exclude: exclude_set,
    }))
}

// An example to test plugin transform.
// Recommended strategy to test plugin's transform is verify
// the Visitor's behavior, instead of trying to run `process_transform` with mocks
// unless explicitly required to do so.
test_inline!(
    Syntax::Es(EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| as_folder(TransformVisitor {
        exclude: HashSet::from_iter(vec!["Admonition".to_string()].iter().cloned())
    }),
    foo,
    // Input codes
    r#"
    import Admonition, { admonitionMap } from './Admonition';
    import Banner from './Banner/Banner';
    import BlockQuote from './BlockQuote';

    export const componentMap = {
        admonition: Admonition,
        banner: Banner,
        'block-quote': BlockQuote,
    };
    "#,
    // Output codes after transformed with plugin
    r#"
    import Banner from './Banner/Banner';
    import BlockQuote from './BlockQuote';

    export const componentMap = {
        banner: Banner,
        'block-quote': BlockQuote,
    };
    "#
);
