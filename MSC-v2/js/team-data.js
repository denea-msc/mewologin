// Edit this list to add/remove members, change their details or move portraits.
// x, y, width and height are pixels on the original 1029 × 473 Figma canvas.
// Higher layers appear in front. Both image states always share the same frame.
window.MSC_TEAM = {
  width: 1029,
  height: 473,
  members: [
    {
      id: 't6', name: 'Alex',
      description: 'Tech Support. Following a theme within the support team, Al helps you solve any problems with soothing vocal tones. He’s also really good at showing you shortcuts and tricks.',
      location: 'Seattle, WA',
      image: 'assets/team/t6.png', hoverImage: 'assets/team/t6h.png',
      x: 0, y: 10, width: 221, height: 293, layer: 1
    },
    {
      id: 't7', name: 'Bill',
      description: 'Training & Support. Bill makes sure the system is working in your center the right way, all the time. He solves Hardware and Network problems and talks with your town tech support for you.',
      location: 'Manchester, NH',
      image: 'assets/team/t7.png', hoverImage: 'assets/team/t7h.png',
      x: 213, y: 9, width: 228, height: 279, layer: 2
    },
    {
      id: 't4', name: 'Ann Marie',
      description: 'Director of Sponsorships. Ann Marie finds local sponsors and partnership opportunities for Senior Centers so their busy Directors can focus on what\'s really important.',
      location: 'Milwaukee, WI',
      image: 'assets/team/t4.png', hoverImage: 'assets/team/t4h.png',
      x: 464, y: 0, width: 226, height: 276, layer: 3
    },
    {
      id: 't5', name: 'Ben',
      description: 'Design & Support. Ben builds the scaffolding for new features while supporting the myriad of different types of senior centers; all while juggling.',
      location: 'Chicago, IL',
      image: 'assets/team/t5.png', hoverImage: 'assets/team/t5h.png',
      x: 723, y: 17, width: 200, height: 271, layer: 4
    },
    {
      id: 't2', name: 'Chris Hamilton',
      description: 'President. The mastermind behind Fun Facts, Chris believes Senior Centers need Data. Chris makes sure each state has an opportunity to use MySeniorCenter.',
      location: 'Boston, MA',
      image: 'assets/team/t2.png', hoverImage: 'assets/team/t2h.png',
      x: 340, y: 150, width: 250, height: 306, layer: 5, flip: true
    },
    {
      id: 't1', name: 'Tina',
      description: 'Director of Operations. Tina talks the language of Senior Center fiscal budgets, helping Senior Centers find local grants and funding. She\'s the first person you\'ll talk to when getting setup.',
      location: 'Boston, MA',
      image: 'assets/team/t1.png', hoverImage: 'assets/team/t1h.png',
      x: 106, y: 138, width: 260, height: 318, layer: 6
    },
    {
      id: 't3', name: 'Jeff Rothberg',
      description: 'Director of Sales. As a former Director at a premiere Intergenerational Center, Jeff can relate. Jeff helps find resources for Centers so you can get our Software quickly and easily.',
      location: 'San Francisco, CA',
      image: 'assets/team/t3.png', hoverImage: 'assets/team/t3h.png',
      x: 765, y: 150, width: 264, height: 323, layer: 7
    },
    {
      id: 't0', name: 'Eric Andersen',
      description: 'A senior center volunteer for over a decade, Eric leads the software development and loves seeing the latest tech being used at centers.',
      location: 'Cambridge, MA',
      image: 'assets/team/t0.png', hoverImage: 'assets/team/t0h.png',
      x: 551, y: 138, width: 265, height: 324, layer: 8,
      // Optional panel anchor in canvas pixels; otherwise placed beside the member.
      panel: { x: 791, y: 111 }
    }
  ]
};
