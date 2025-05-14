use std::collections::HashSet;
use swc_core::ecma::{
    ast::*,
    transforms::testing::test_inline,
    visit::{as_folder, VisitMut, VisitMutWith},
};
use swc_ecma_parser::{EsConfig, Syntax};

pub struct RemoveDirectivesTransform {
    pub includes: HashSet<String>,
}

impl VisitMut for RemoveDirectivesTransform {
    // Implement necessary visit_mut_* methods for actual custom transform.
    // A comprehensive list of possible visitor methods can be found here:
    // https://rustdoc.swc.rs/swc_ecma_visit/trait.VisitMut.html

    /**
     * This method visits module imports and exports.
     * We specifically want to check default and named imports to see if the components that
     * they have are in the list of directives we want to keep. We specifically look at the name of the components
     * e.g. `import Card from './Card;` will check and see if the `Card` variable is a directive that the project
     * uses.
     */
    fn visit_mut_module_items(&mut self, n: &mut std::vec::Vec<ModuleItem>) {
        n.visit_mut_children_with(self);

        n.retain(|item| match item {
            ModuleItem::ModuleDecl(module_decl) => match module_decl {
                ModuleDecl::Import(import) => {
                    let src = *import.src.to_owned();

                    let import_src_atom = src.value;
                    let import_src = import_src_atom.as_str();

                    let first_char = import_src.chars().nth(0).unwrap_or_default();

                    // we don't want to remove non-relative imports
                    if first_char != '.' {
                        return true;
                    }

                    for spec in import.specifiers.iter() {
                        match spec {
                            ImportSpecifier::Default(default_import) => {
                                let component_name = default_import.local.sym.as_str();

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
                    return false;
                }
                _ => return true,
            },
            _ => return true,
        });
    }

    /**
     * This method traverses variable declarations. We want to check the `componentMap` and `roleMap` variables.
     */
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

/**
* This function removes unused directives from the `componentMap` and `roleMap` objects.
*/
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
                        _ => return true,
                    }
                }
                _ => return true,
            }
        }
        _ => return true,
    })
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
                "Admonition".to_string(),
                "Banner".to_string(),
                "RoleHighlight".to_string(),
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
  import RoleHighlight from './Roles/Highlight';
  import RoleIcon from './Roles/Icon';

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
  import React from 'react';
  import { LAZY_COMPONENTS } from './ComponentFactoryLazy';

  import Admonition, { admonitionMap } from './Admonition';
  import Banner from './Banner/Banner';
  import RoleHighlight from './Roles/Highlight';

  const roleMap = {
    'highlight-blue': RoleHighlight,
    'highlight-green': RoleHighlight,
    'highlight-red': RoleHighlight,
    'highlight-yellow': RoleHighlight,
};

  export const componentMap = {
      admonition: Admonition,
      banner: Banner,
  };
  "#
);
