import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Slider } from "@radix-ui/react-slider";
import { motion, AnimatePresence } from "framer-motion";

const Filter = ({ searchTerm, setSearchTerm, filterSite, setFilterSite, priceRange, setPriceRange, isFilterExpanded, setIsFilterExpanded }) => (
  <div className="rounded-lg overflow-hidden">
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex-grow">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search properties..."
            className="w-full pl-10 pr-4 py-2 rounded-full border-gray-300 focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <Select
        value={filterSite}
        onValueChange={setFilterSite}
        className="w-full sm:w-auto bg-white"
      >
        <SelectTrigger className="w-full sm:w-40 rounded-full">
          <SelectValue placeholder="Filter by site" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sites</SelectItem>
          <SelectItem value="argenprop">Argenprop</SelectItem>
          <SelectItem value="zonaprop">Zonaprop</SelectItem>
        </SelectContent>
      </Select>
      <Button
        className="w-full sm:w-auto rounded-full bg-blue-600 text-white hover:bg-blue-700"
        onClick={() => setIsFilterExpanded(!isFilterExpanded)}
      >
        {isFilterExpanded ? (
          <><ChevronUp className="mr-2 h-4 w-4" /> Hide Filters</>
        ) : (
          <><ChevronDown className="mr-2 h-4 w-4" /> More Filters</>
        )}
      </Button>
    </div>
    <AnimatePresence>
      {isFilterExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="border-t border-gray-200"
        >
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Range
              </label>
              <Slider
                value={priceRange}
                min={0}
                max={1000000}
                step={10000}
                onValueChange={setPriceRange}
              />
              <div className="mt-2 text-sm text-gray-600">
                ${priceRange[0]} - ${priceRange[1]}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default Filter;
