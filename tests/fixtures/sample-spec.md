---
stage: 2
project: smoke-test
layout_pattern: form
components_needed: [Button, TextInput, Alert]
new_components: []
interactions: [validate-on-blur]
states: [empty, loading, error, success]
data_dependencies: []
---

# Smoke test design spec

A simple form with email + password fields. Validates on blur. Shows loading during submit, error on failure, success on completion.
