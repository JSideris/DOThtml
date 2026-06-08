# DOThtml Error Codes

This page contains a reference for all framework-level errors thrown by DOThtml.

## 3
**Message:** Attempted to move nodes into a detached or null parent. The container may have been cleared externally.

## 4
**Message:** Attempted to render a node before a reference node that is detached from the DOM. This usually happens if the container was cleared manually (e.g., via innerHTML or .empty()) while DOThtml was managing it.

## 5
**Message:** Cannot batch render items into a null parent. The collection's anchor nodes may have been removed from the DOM.

## 6
**Message:** Can't branch off of a non-conditional node.

## 7
**Message:** Invalid node to set ${A} attribute.

## 8
**Message:** Invalid node to set ${event} listener.

## 9
**Message:** Invalid render target.

## 10
**Message:** "${prop}" is not a valid method on the dot object.

## 11
**Message:** "${prop}" is not a valid method on this DOThtml chain.

