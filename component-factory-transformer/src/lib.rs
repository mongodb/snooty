mod get_components;

use get_components::GetComponentNamesTransform;
use serde::Deserialize;
use std::collections::HashSet;
use swc_core::ecma::{
    ast::*,
    transforms::testing::test_inline,
    visit::{as_folder, FoldWith, VisitMut, VisitMutWith},
};
use swc_ecma_parser::{EsConfig, Syntax};

use swc_core::plugin::{plugin_transform, proxies::TransformPluginProgramMetadata};

pub struct RemoveDirectivesTransform {
    includes: HashSet<String>,
}

impl VisitMut for RemoveDirectivesTransform {
    // TODO: Add relative import check
    // Implement necessary visit_mut_* methods for actual custom transform.
    // A comprehensive list of possible visitor methods can be found here:
    // https://rustdoc.swc.rs/swc_ecma_visit/trait.VisitMut.html
    fn visit_mut_module_items(&mut self, n: &mut std::vec::Vec<ModuleItem>) {
        n.visit_mut_children_with(self);

        n.retain(|item| match item {
            ModuleItem::ModuleDecl(module_decl) => match module_decl {
                ModuleDecl::Import(import) => {
                    let src = *import.src.to_owned();

                    let import_src_atom = src.value;
                    let import_src = import_src_atom.as_str();

                    let first_char = import_src.chars().nth(0).unwrap_or_default();

                    if first_char != '.' {
                        return true;
                    }

                    for spec in import.specifiers.iter() {
                        match spec {
                            ImportSpecifier::Default(default) => {
                                let component_name = default.local.sym.as_str();

                                if self.includes.contains(component_name) {
                                    return true;
                                }
                            }

                            ImportSpecifier::Named(named) => {
                                let component_name = named.local.sym.as_str();
                                if self.includes.contains(component_name) {
                                    return true;
                                }
                            }
                            _ => {}
                        }
                    }
                    false
                }
                _ => true,
            },
            _ => true,
        });
    }

    fn visit_mut_var_declarator(&mut self, n: &mut VarDeclarator) {
        match n.name {
            Pat::Ident(ref mut name) => {
                let variable_name = name.id.sym.as_str().to_string();
                if variable_name == "componentMap" || variable_name == "roleMap" {
                    match n.init {
                        Some(ref mut init) => match **init {
                            Expr::Object(ref mut obj) => {
                                remove_unused_obj_directives(&self.includes, obj);
                            }
                            _ => {}
                        },
                        _ => {}
                    }
                }
            }
            _ => {}
        }
    }
}

fn remove_unused_obj_directives(includes: &HashSet<String>, n: &mut ObjectLit) {
    n.props.retain(|prop| match prop {
        PropOrSpread::Prop(p) => {
            let property = *p.to_owned();
            match property {
                Prop::KeyValue(key_value) => {
                    let value = *key_value.value;
                    match value {
                        Expr::Ident(value_ident) => {
                            let component_name = value_ident.sym.as_str();
                            includes.contains(component_name)
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

#[derive(Clone, Debug, Deserialize)]
pub struct Config {
    #[serde(default)]
    pub includes: Vec<String>,
}

#[plugin_transform]
pub fn process_transform(program: Program, metadata: TransformPluginProgramMetadata) -> Program {
    let config_str = &metadata
        .get_transform_plugin_config()
        .expect("Failed to retrieve plugin config for remove-unused-directives");

    let config: Config = serde_json::from_str::<Option<Config>>(&config_str)
        .expect("Config could not be deserialized")
        .unwrap_or_else(|| Config { includes: vec![] });

    let includes_set: HashSet<String> = HashSet::from_iter(config.includes.iter().cloned());
    let mut get_components_transform = GetComponentNamesTransform {
        includes: includes_set.clone(),
        component_names: HashSet::from_iter(vec!["LAZY_COMPONENTS".to_string()].iter().cloned()),
    };

    program
        .clone()
        .fold_with(&mut as_folder(&mut get_components_transform));

    program.fold_with(&mut as_folder(RemoveDirectivesTransform {
        includes: get_components_transform.component_names,
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
    |_| as_folder(RemoveDirectivesTransform {
        includes: HashSet::from_iter(
            vec![
                "Banner".to_string(),
                "BlockQuote".to_string(),
                "LAZY_COMPONENTS".to_string()
            ]
            .iter()
            .cloned()
        )
    }),
    foo,
    // Input codes
    r#"
    import React from 'react';
    import { LAZY_COMPONENTS } from './ComponentFactoryLazy';

    import Admonition, { admonitionMap } from './Admonition';
    import Banner from './Banner/Banner';
    import BlockQuote from './BlockQuote';

    export const componentMap = {
        admonition: Admonition,
        banner: Banner,
        blockquote: BlockQuote,
    };
    "#,
    // Output codes after transformed with plugin
    r#"
    import React from 'react';
    import { LAZY_COMPONENTS } from './ComponentFactoryLazy';

    import Banner from './Banner/Banner';
    import BlockQuote from './BlockQuote';

    export const componentMap = {
        banner: Banner,
        blockquote: BlockQuote,
    };
    "#
);
