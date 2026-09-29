---
"dothtml-interfaces": patch
---

Allow boxShadow to accept CSS string values in addition to structured IShadowProp objects. This improves DX for AI agents and developers who prefer using standard CSS shadow syntax like `boxShadow("0 1px 3px rgba(0, 0, 0, 0.1)")` without requiring type assertions.
