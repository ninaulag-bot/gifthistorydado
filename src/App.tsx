import React, { useState, useMemo } from 'react'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { FilterBar } from './components/FilterBar'
import { GiftList } from './components/GiftList'
import { Timeline } from './components/Timeline'
import { Relationships } from './components/Relationships'
import { PersonProfile } from './components/PersonProfile'
import { AddGiftModal } from './components/AddGiftModal'
import { AddConnectionModal } from './components/AddConnectionModal'
import { GiftDetailModal } from './components/GiftDetailModal'
import {
  gifts as initialGifts,
  people as initialPeople,
  PersonData,
  GiftItem,
} from './data/gifts'
type ViewType =
  | 'all-gifts'
  | 'received'
  | 'given'
  | 'timeline'
  | 'relationships'
type FilterType = 'all' | 'received' | 'given'
export function App() {
  const [activeView, setActiveView] = useState<ViewType>('all-gifts')
  const [activePerson, setActivePerson] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddGiftOpen, setIsAddGiftOpen] = useState(false)
  const [isAddConnectionOpen, setIsAddConnectionOpen] = useState(false)
  const [editingPerson, setEditingPerson] = useState<PersonData | null>(null)
  const [peopleList, setPeopleList] = useState<PersonData[]>(initialPeople)
  const [giftForPerson, setGiftForPerson] = useState<string | null>(null)
  const [giftsList, setGiftsList] = useState<GiftItem[]>(initialGifts)
  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null)
  const [cameFromView, setCameFromView] = useState<ViewType | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const handleSavePerson = (updatedPerson: PersonData) => {
    if (editingPerson) {
      setPeopleList((prev) =>
        prev.map((p) => (p.name === editingPerson.name ? updatedPerson : p)),
      )
      if (
        activePerson === editingPerson.name &&
        updatedPerson.name !== editingPerson.name
      ) {
        setActivePerson(updatedPerson.name)
      }
    } else {
      setPeopleList((prev) => [...prev, updatedPerson])
    }
  }
  const handleViewChange = (view: ViewType) => {
    setActiveView(view)
    setActivePerson(null)
    setSearchQuery('')
    if (view === 'received') {
      setActiveFilter('received')
      setActiveView('all-gifts')
    } else if (view === 'given') {
      setActiveFilter('given')
      setActiveView('all-gifts')
    } else {
      setActiveFilter('all')
    }
  }
  const handlePersonChange = (person: string | null) => {
    setActivePerson(person)
    if (person) {
      setActiveView('all-gifts')
      setActiveFilter('all')
      setSearchQuery('')
    }
  }
  const filteredGifts = useMemo(() => {
    let result = [...giftsList]
    if (activePerson) {
      result = result.filter((g) => g.person.name === activePerson)
    }
    if (activeFilter === 'received') {
      result = result.filter((g) => g.direction === 'received')
    } else if (activeFilter === 'given') {
      result = result.filter((g) => g.direction === 'given')
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.person.name.toLowerCase().includes(q) ||
          g.occasion.toLowerCase().includes(q),
      )
    }
    result.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
    return result
  }, [activePerson, activeFilter, searchQuery, giftsList])
  const effectiveView: ViewType = useMemo(() => {
    if (activeView === 'timeline') return 'timeline'
    if (activeView === 'relationships') return 'relationships'
    if (activeFilter === 'received') return 'received'
    if (activeFilter === 'given') return 'given'
    return 'all-gifts'
  }, [activeView, activeFilter])
  const isGiftListView = activeView === 'all-gifts'
  const activePersonData = activePerson
    ? (peopleList.find((p) => p.name === activePerson) ?? null)
    : null
  return (
    <div className="flex flex-col h-screen bg-cream font-sans">
      <Header
        totalGifts={giftsList.length}
        totalPeople={peopleList.length}
        onAddGift={() => setIsAddGiftOpen(true)}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeView={effectiveView}
          onViewChange={handleViewChange}
          activePerson={activePerson}
          onPersonChange={handlePersonChange}
          people={peopleList}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto px-5 sm:px-8 py-5 sm:py-6 lg:py-8 bg-cream">
          {activePerson && activePersonData ? (
            <PersonProfile
              person={activePersonData}
              gifts={giftsList}
              onBack={() => {
                setActivePerson(null)
                if (cameFromView === 'relationships') {
                  setActiveView('relationships')
                }
                setCameFromView(null)
              }}
              backLabel={
                cameFromView === 'relationships'
                  ? 'Back to Relationships'
                  : undefined
              }
              onEditPerson={(p) => {
                setEditingPerson(p)
                setIsAddConnectionOpen(true)
              }}
              onAddGift={(name) => {
                setGiftForPerson(name)
                setIsAddGiftOpen(true)
              }}
              onGiftClick={(gift) => setSelectedGift(gift)}
            />
          ) : (
            <>
              {isGiftListView && (
                <>
                  <FilterBar
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onAddGift={() => setIsAddGiftOpen(true)}
                  />
                  <GiftList
                    gifts={filteredGifts}
                    onGiftClick={(gift) => setSelectedGift(gift)}
                  />
                </>
              )}

              {activeView === 'timeline' && (
                <Timeline
                  gifts={giftsList}
                  onGiftClick={(gift) => setSelectedGift(gift)}
                />
              )}

              {activeView === 'relationships' && (
                <Relationships
                  people={peopleList}
                  gifts={giftsList}
                  onPersonClick={(name) => {
                    setCameFromView('relationships')
                    setActivePerson(name)
                    setActiveView('all-gifts')
                    setActiveFilter('all')
                    setSearchQuery('')
                  }}
                  onAddConnection={() => setIsAddConnectionOpen(true)}
                  onAddGiftForPerson={(name) => {
                    setGiftForPerson(name)
                    setIsAddGiftOpen(true)
                  }}
                />
              )}
            </>
          )}
        </main>
      </div>

      <AddGiftModal
        isOpen={isAddGiftOpen}
        onClose={() => {
          setIsAddGiftOpen(false)
          setGiftForPerson(null)
        }}
        people={peopleList}
        preselectedPerson={giftForPerson}
        onAddPerson={(newPerson) => {
          setPeopleList((prev) => [...prev, newPerson])
        }}
      />

      <AddConnectionModal
        isOpen={isAddConnectionOpen}
        onClose={() => {
          setIsAddConnectionOpen(false)
          setEditingPerson(null)
        }}
        person={editingPerson}
        onSave={handleSavePerson}
      />

      <GiftDetailModal
        isOpen={!!selectedGift}
        onClose={() => setSelectedGift(null)}
        gift={selectedGift}
        people={peopleList}
        onSave={(updatedGift) => {
          setGiftsList((prev) =>
            prev.map((g) => (g.id === updatedGift.id ? updatedGift : g)),
          )
          setSelectedGift(updatedGift)
        }}
      />
    </div>
  )
}

export default App
