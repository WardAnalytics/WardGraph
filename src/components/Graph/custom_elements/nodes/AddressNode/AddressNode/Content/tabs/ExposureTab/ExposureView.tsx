import { FC, useState, useContext } from "react";
import { Transition } from "@headlessui/react";
import {
  UserIcon,
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
} from "@heroicons/react/20/solid";

import { Exposure, Category, Entity } from "../../../../../../api/model";

import formatNumber from "../../../../../../utils/number_conversion";
import COLORS from "../../../../../_common/enums/colors";
import CATEGORY_INFO from "../../../../../_common/enums/categories";

import Badge from "../../../../../_common/visuals/badges/Badge";

import { ExposureTabContext } from "./ExposureTabGeneric";

/** This component is a row that represents an entity in the exposure column.
 * It consists of an icon, text, a risk level badge, and a quantity traded.
 *
 * @param entity The entity to be displayed.
 * @param total The total exposure of the analyzed address.
 * @param isLast Whether this is the last entity in the category.
 * @param incoming Whether this is the incoming or outgoing exposure.
 */

interface EntityRowProps {
  entity: Entity;
  total: number; // The total is required to calculate the % of the entity
  isLast: boolean;
  incoming: boolean;
}

const EntityRow: FC<EntityRowProps> = ({ entity, total, isLast, incoming }) => {
  const { setFocusedEntity } = useContext(ExposureTabContext)!;

  // Calculate an exposure percentage rounded to 2 decimal places
  const exposurePercentage =
    Math.round((entity.quantity / total) * 10000) / 100;

  // Convert to string. If lower than 0.01% or close to 100%, add a ~ to the front
  let exposurePercentageString = exposurePercentage.toString();
  if (exposurePercentage < 0.01 || exposurePercentage > 99.99) {
    exposurePercentageString = "~" + exposurePercentageString;
  }

  return (
    <div className="flex h-14 w-full flex-row items-center pl-4">
      {/* Vertical line going downwards */}
      <div
        className={`w-[1px] bg-gray-300 ${isLast ? "mb-7 h-7" : "h-full"}`}
      ></div>

      {/* Vertical line going sideways */}
      <div className={`h-[1px] w-5 bg-gray-300`}></div>

      <div
        className="w-full cursor-pointer flex-col space-y-1 rounded-md p-2 transition-all duration-100 hover:bg-gray-100"
        onClick={() => setFocusedEntity({ entity: entity, incoming: incoming })}
      >
        <span className="flex items-center space-x-2">
          <p className="text-sm font-semibold text-gray-800">{entity.name}</p>
        </span>

        <div className="flex items-center gap-x-2 text-xs text-gray-500">
          <p>{formatNumber(entity.quantity)}</p>
          <p>{`(${exposurePercentageString}%)`}</p>

          <svg
            viewBox="0 0 2 2"
            className="h-0.5 w-0.5 fill-current align-middle"
          >
            <circle cx={1} cy={1} r={1} />
          </svg>
          <p>{`${entity.addresses.length} ${
            entity.addresses.length === 1 ? "Address" : "Addresses"
          }`}</p>
        </div>
      </div>
    </div>
  );
};

/** This component is a badge that represents the risk level of a category.
 * The color and risk level are determined by the risk level of the category.
 *
 * @param category The category to be displayed.
 */

const RiskBadge: FC<{ category: string }> = ({ category }) => {
  // Get the risk level of the category
  const risk = CATEGORY_INFO[category]?.risk ?? 0;

  // Now pick a color and risk level for the badge based on the risk
  let color: COLORS = COLORS.Green;
  let riskName: string = "Low";

  if (risk >= 2.5) {
    color = COLORS.Yellow;
    riskName = "Medium";
  }

  if (risk >= 7) {
    color = COLORS.Red;
    riskName = "High";
  }

  if (risk >= 9) {
    color = COLORS.Purple;
    riskName = "Severe";
  }

  return <Badge color={color} text={riskName} />;
};

/** This component is an icon that represents a category.
 * The icon is determined by the category.
 *
 * @param category The category to be displayed.
 */

const CategoryIcon: FC<{ category: string }> = ({ category }) => {
  const Icon = CATEGORY_INFO[category]?.icon ?? UserIcon;
  return <Icon />;
};

/** This component is a row that represents a category in the exposure column.
 * It consists of an icon, text, a risk level badge, and a quantity traded.ç
 *
 * @param category The category to be displayed.
 * @param total The total exposure of the analyzed address.
 * @param incoming Whether this is the incoming or outgoing exposure.
 */

interface CategoryRowProps {
  category: Category;
  total: number; // The total is required to calculate the % of the category
  incoming: boolean;
}

const CategoryRow: FC<CategoryRowProps> = ({ category, total, incoming }) => {
  // Whether or not this category is expanded to show its entities
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpanded = () => setIsExpanded(!isExpanded);

  // Calculate an exposure percentage rounded to 2 decimal places
  const exposurePercentage = Math.round((category.total / total) * 10000) / 100;

  // Convert to string. If lower than 0.01% or close to 100%, add a ~ to the front
  let exposurePercentageString = exposurePercentage.toString();
  if (exposurePercentage < 0.01 || exposurePercentage > 99.99) {
    exposurePercentageString = "~" + exposurePercentageString;
  }

  return (
    <>
      <div
        className="w-full cursor-pointer rounded-md p-1 transition-all duration-100 hover:bg-gray-100"
        onClick={toggleExpanded}
      >
        <div className="flex items-center space-x-2">
          {/* Category Icon */}
          <span
            className={`h-7 w-7 transition-all duration-100 ${
              isExpanded ? "text-gray-500" : "text-gray-300"
            }`}
          >
            <CategoryIcon category={category.name} />
          </span>

          {/* Column including the name, risk level badge, and quantity traded */}
          <div className="flex-col space-y-1">
            <span className="flex items-center space-x-2">
              <p className="text-sm font-semibold text-gray-800">
                {category.name}
              </p>
              <RiskBadge category={category.name} />
            </span>
            <div className="flex items-center gap-x-2 text-xs text-gray-500">
              <p>{formatNumber(category.total)}</p>
              <p>{`(${exposurePercentageString}%)`}</p>

              <svg
                viewBox="0 0 2 2"
                className="h-0.5 w-0.5 fill-current align-middle"
              >
                <circle cx={1} cy={1} r={1} />
              </svg>
              <p>{`${category.entities.length} ${
                category.entities.length === 1 ? "Entity" : "Entities"
              }`}</p>
            </div>
          </div>
        </div>
      </div>

      {/* If the category is expanded, show its entities and a small separting line below them */}
      <Transition
        appear={true}
        show={isExpanded}
        enter="transition-all ease-in-out duration-150 transform"
        enterFrom="-translate-y-10  opacity-0"
        enterTo="translate-y-0 opacity-100"
        leave="transition-all ease-in-out duration-150 transform"
        leaveFrom="translate-y-0 opacity-100"
        leaveTo="-translate-y-10 opacity-0"
      >
        <div>
          <ul className="w-auto flex-grow flex-col pt-3">
            {category.entities.map((entity) => (
              <li
                className="flex w-full items-center space-x-3"
                key={entity.name}
              >
                <EntityRow
                  entity={entity}
                  total={category.total}
                  isLast={
                    category.entities.indexOf(entity) ===
                    category.entities.length - 1
                  }
                  incoming={incoming}
                />
              </li>
            ))}
          </ul>
        </div>
      </Transition>
    </>
  );
};

/** This component is the header for the exposure column.
 * It consists of an icon, text, and a total.
 *
 * @param incoming Whether this is the incoming or outgoing exposure.
 * @param total The total exposure of the analyzed address.
 */

interface ExposureColumnHeaderProps {
  incoming: boolean;
  total: number;
}

const ExposureColumnHeader: FC<ExposureColumnHeaderProps> = ({
  incoming,
  total,
}) => {
  // Change icon and text based on whether this is incoming or outgoing
  const Icon = incoming ? ArrowDownLeftIcon : ArrowUpRightIcon;
  const text = incoming ? "Incoming" : "Outgoing";

  return (
    <div className="mb-3 flex items-center space-x-2 px-1">
      <Icon className="h-7 w-7 text-gray-300" />
      <div className="flex items-center gap-x-1.5 text-xs text-gray-500">
        <p className="text-sm font-semibold uppercase text-gray-800">{text}</p>
        <svg
          viewBox="0 0 2 2"
          className="h-0.5 w-0.5 fill-current align-middle"
        >
          <circle cx={1} cy={1} r={1} />
        </svg>
        <p>{formatNumber(total) + " Total"}</p>
      </div>
    </div>
  );
};

/** This component lists the exposures of a single direction (incoming or outgoing).
 * It consists of a header and a list of categories.
 *
 * @param exposure The exposure of the analyzed address.
 * @param incoming Whether this is the incoming or outgoing exposure.
 */

interface ExposureColumnProps {
  incoming: boolean;
  exposure: Exposure;
}

const ExposureColumn: FC<ExposureColumnProps> = ({ exposure, incoming }) => {
  // Returns a column of categories
  return (
    <div className="flex w-full flex-col divide-y">
      <ExposureColumnHeader incoming={incoming} total={exposure.total} />
      <ul className="w-auto flex-grow flex-col space-y-2 pt-3">
        {exposure.categories.map((category) => (
          <li
            className="-translate-y- w-full flex-col items-center"
            key={category.name}
          >
            <CategoryRow
              category={category}
              total={exposure.total}
              incoming={incoming}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

/** This component lists the the outgoing and incoming exposures of the analyzed address.
 * It consists of two lists: the incoming and the outgoing exposures.
 */

const ExposureView: FC = () => {
  // Extract incoming and outgoing exposure from context
  const { incomingExposure, outgoingExposure } =
    useContext(ExposureTabContext)!;

  return (
    <div className="flex w-full flex-col gap-x-4 gap-y-16 divide-gray-300 lg:flex-row">
      <ExposureColumn exposure={incomingExposure} incoming={true} />
      <ExposureColumn exposure={outgoingExposure} incoming={false} />
    </div>
  );
};

export default ExposureView;
