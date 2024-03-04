use std::path::PathBuf;

use swc_ecma_transforms_testing::{test_fixture, FixtureTestConfig};

#[testing::fixture("tests/input.js")]
fn fixture(input: PathBuf) {}
