import React, { useState, useMemo } from 'react'
import { useLocation, useNavigate, matchPath } from 'react-router-dom'
import { Header } from './components/Header'
import { Sidebar, type SidebarNavigateTo } from './components/Sidebar'
import { GiftList } from './components/GiftList'
import { Timeline } from './components/Timeline'
import { PersonProfilePage } from './components/PersonProfilePage'
import { AddGiftModal } from './components/AddGiftModal'
import { AddConnectionModal } from './components/AddConnectionModal'
import { GiftDetailPage } from './components/GiftDetailPage'
import {
  gifts as initialGifts,
  people as initialPeople,
  PersonData,
  GiftItem,
} from './data/gifts'

type ViewType = 'all-gifts' | 'timeline'
type FilterType = 'all' | 'received' | 'given'

function App() {
  const location = useLocation()
  const navigate = useNavigate()

  const giftRouteMatch = matchPath(
    { path: '/gifts/:giftId', end: true },
    location.pathname,
  )
  const peopleRouteMatch = matchPath(
    { path: '/people/:personName', end: true },
    location.pathname,
  )

  const sidebarActivePerson = peopleRouteMatch?.params.personName ?? null

  const [activeView, setActiveView] = useState<ViewType>('all-gifts')
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [isAddGiftOpen, setIsAddGiftOpen] = useState(false)
  const [isAddConnectionOpen, setIsAddConnectionOpen] = useState(false)
  const [editingPerson, setEditingPerson] = useState<PersonData | null>(null)
  const [peopleList, setPeopleList] = useState<PersonData[]>(initialPeople)
  const [giftForPerson, setGiftForPerson] = useState<string | null>(null)
  const [giftsList, setGiftsList] = useState<GiftItem[]>(initialGifts)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSavePerson = (updatedPerson: PersonData) => {
    if (editingPerson) {
      setPeopleList((prev) =>
        prev.map((p) => (p.name === editingPerson.name ? updatedPerson : p)),
      )
      const m = matchPath(
        { path: '/people/:personName', end: true },
        location.pathname,
      )
      if (
        m?.params.personName === editingPerson.name &&
        updatedPerson.name !== editingPerson.name
      ) {
        navigate(`/people/${encodeURIComponent(updatedPerson.name)}`, {
          replace: true,
        })
      }
    } else {
      setPeopleList((prev) => [...prev, updatedPerson])
    }
  }

  const handleSidebarNavigate = (to: SidebarNavigateTo) => {
    if (to === 'timeline') {
      setActiveView('timeline')
      setActiveFilter('all')
      navigate('/')
      return
    }
    setActiveView('all-gifts')
    if (to === 'gifts-all') {
      setActiveFilter('all')
    } else if (to === 'gifts-given') {
      setActiveFilter('given')
    } else {
      setActiveFilter('received')
    }
    navigate('/')
  }

  const givenGiftCount = useMemo(
    () => giftsList.filter((g) => g.direction === 'given').length,
    [giftsList],
  )
  const receivedGiftCount = useMemo(
    () => giftsList.filter((g) => g.direction === 'received').length,
    [giftsList],
  )

  const handlePersonChange = (person: string | null) => {
    if (person) {
      setActiveView('all-gifts')
      setActiveFilter('all')
      navigate(`/people/${encodeURIComponent(person)}`)
    } else {
      navigate('/')
    }
  }

  const filteredGifts = useMemo(() => {
    let result = [...giftsList]
    if (activeFilter === 'received') {
      result = result.filter((g) => g.direction === 'received')
    } else if (activeFilter === 'given') {
      result = result.filter((g) => g.direction === 'given')
    }
    result.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
    return result
  }, [activeFilter, giftsList])

  const isGiftListView = activeView === 'all-gifts'

  const handleGiftSaved = (updatedGift: GiftItem) => {
    setGiftsList((prev) =>
      prev.map((g) => (g.id === updatedGift.id ? updatedGift : g)),
    )
  }

  /** Full-screen gift detail: no archive header, sidebar, or main chrome */
  if (giftRouteMatch) {
    return (
      <div className="h-dvh min-h-0 w-full overflow-hidden bg-cream font-sans">
        <GiftDetailPage
          key={giftRouteMatch.params.giftId}
          giftsList={giftsList}
          peopleList={peopleList}
          onGiftSaved={handleGiftSaved}
        />
      </div>
    )
  }

  let mainContent: React.ReactNode
  if (peopleRouteMatch) {
    mainContent = (
      <PersonProfilePage
        key={peopleRouteMatch.params.personName}
        peopleList={peopleList}
        giftsList={giftsList}
        onEditPerson={(p) => {
          setEditingPerson(p)
          setIsAddConnectionOpen(true)
        }}
        onAddGift={(name) => {
          setGiftForPerson(name)
          setIsAddGiftOpen(true)
        }}
      />
    )
  } else {
    mainContent = (
      <>
        {isGiftListView && (
          <div className="-mx-5 flex min-h-0 flex-1 flex-col sm:-mx-8">
            <GiftList gifts={filteredGifts} />
          </div>
        )}

        {activeView === 'timeline' && (
          <div className="min-h-0 flex-1">
            <Timeline gifts={giftsList} />
          </div>
        )}
      </>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-cream font-sans">
      <Header
        totalGifts={giftsList.length}
        totalPeople={peopleList.length}
        onAddGift={() => {
          setGiftForPerson(null)
          setIsAddGiftOpen(true)
        }}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Sidebar
          activeView={activeView}
          activeFilter={activeFilter}
          onNavigate={handleSidebarNavigate}
          activePerson={sidebarActivePerson}
          onPersonChange={handlePersonChange}
          people={peopleList}
          totalGiftCount={giftsList.length}
          givenGiftCount={givenGiftCount}
          receivedGiftCount={receivedGiftCount}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-white px-5 py-5 sm:px-8 sm:py-6 lg:py-8">
          {mainContent}
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
    </div>
  )
}

export { App }
export default App
