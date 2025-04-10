mod filter_components;
mod get_components;

use filter_components::RemoveDirectivesTransform;
use get_components::GetComponentNamesTransform;
use serde::Deserialize;
use std::collections::HashSet;
use swc_core::ecma::{
    ast::*,
    visit::{as_folder, FoldWith},
};
use swc_ecma_parser::{EsConfig, Syntax};

use swc_core::plugin::{plugin_transform, proxies::TransformPluginProgramMetadata};

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
        component_names: HashSet::from_iter(
            // Default values that we want to keep.
            vec![
                "LAZY_COMPONENTS".to_string(),
                "Admonition".to_string(),
                "Card".to_string(),
            ]
            .iter()
            .cloned(),
        ),
    };

    program
        .clone()
        .fold_with(&mut as_folder(&mut get_components_transform));

    program.fold_with(&mut as_folder(RemoveDirectivesTransform {
        includes: get_components_transform.component_names,
    }))
}
