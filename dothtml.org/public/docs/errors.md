# DOThtml Error Codes

This page contains a reference for all framework-level errors thrown by DOThtml.

## 3
**Message:** Attempted to move nodes into a detached or null parent. The container may have been cleared externally.

## 4
**Message:** Attempted to perform a DOM operation on a node with no parent. This can happen if the container was cleared externally or if there is a conflict during batch rendering.

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

## 12
**Message:** each/when does not accept a function with parameters as a collection or condition. Pass an array, a plain object, a signal, a binding, or a zero-arg getter.

## 13
**Message:** when/otherwiseWhen then-content cannot be a function. Pass markup or a component, not a factory. Use a zero-arg getter or computed for the condition.

## 14
**Message:** each() collection must be an array or a plain object. Signals, bindings, and zero-arg getters must resolve to an array or plain object. Set, Map, Promise, null, and undefined are not valid collections.

## 15
**Message:** Attribute or element content cannot be a function. Pass a value, a signal, a binding, or a zero-arg getter.

