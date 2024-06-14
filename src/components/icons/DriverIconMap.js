import IconC from '../icons/C';
import IconCompass from '../icons/Compass';
import IconCpp from '../icons/Cpp';
import IconCsharp from '../icons/Csharp';
import IconGo from '../icons/Go';
import IconJava from '../icons/Java';
import IconKotlin from '../icons/Kotlin';
import IconNode from '../icons/Node';
import IconPHP from '../icons/Php';
import IconPython from '../icons/Python';
import IconRuby from '../icons/Ruby';
import IconRust from '../icons/Rust';
import IconScala from '../icons/Scala';
import IconShell from '../icons/Shell';
import IconSwift from '../icons/Swift';
import IconObjectiveC from '../icons/ObjectiveC';
import IconJavascript from '../icons/Javascript';
import IconTypescript from '../icons/Typescript';
import IconDart from '../icons/Dart';
import IconRustDark from './RustDark';
import IconNodeDark from './NodeDark';
import IconJavaDark from './JavaDark';

export const DRIVER_ICON_MAP = {
  c: IconC,
  compass: IconCompass,
  cpp: IconCpp,
  'cpp-sdk': IconCpp,
  csharp: IconCsharp,
  dart: IconDart,
  go: IconGo,
  java: IconJava,
  'java-sync': IconJava,
  'java-async': IconJava,
  javascript: IconJavascript,
  kotlin: IconKotlin,
  'java-kotlin': IconKotlin,
  'kotlin-coroutine': IconKotlin,
  'kotlin-sync': IconKotlin,
  nodejs: IconNode,
  objectivec: IconObjectiveC,
  php: IconPHP,
  python: IconPython,
  ruby: IconRuby,
  rust: IconRust,
  'rust-sync': IconRust,
  'rust-async': IconRust,
  scala: IconScala,
  shell: IconShell,
  swift: IconSwift,
  'swift-async': IconSwift,
  'swift-sync': IconSwift,
  typescript: IconTypescript,
};

export const setDriversIconsMap = (darkMode) => {
  const driverIconMap = Object.create(DRIVER_ICON_MAP);

  if (darkMode) {
    driverIconMap.java = IconJavaDark;
    driverIconMap['java-sync'] = IconJavaDark;
    driverIconMap['java-async'] = IconJavaDark;
    driverIconMap.nodejs = IconNodeDark;
    driverIconMap.rust = IconRustDark;
    driverIconMap['rust-async'] = IconRustDark;
    driverIconMap['rust-sync'] = IconRustDark;
  }

  return driverIconMap;
};
