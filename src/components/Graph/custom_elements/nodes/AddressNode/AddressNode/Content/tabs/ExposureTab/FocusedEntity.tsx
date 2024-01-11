import { Entity } from "../../../../../../../../../api/model";

/** This component represents an entity that is currently focused in the exposure tab.
 * It is used to display the entity name and whether it's incoming or outgoing.
 *
 * @param entity: The entity to display
 * @param incoming: Whether the entity is incoming or outgoing
 */

export default interface FocusedEntity {
  entity: Entity;
  incoming: boolean;
}
