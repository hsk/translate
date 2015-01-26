- 9 Conclusion
- 9 まとめ

	We have presented an approach that can effectively support the use of dependent types in practical programming, allowing for specification and inference of signifi-cantly more precise type information and thus facilitating program error detection and compiler optimization.

	私たちは、効果的に仕様とsignifi - cantlyより正確な型情報の推論とそのプログラムエラー検出およびコンパイラの最適化を容易にするためにできるように、実用的なプログラミングで依存型の使用をサポートすることができますアプローチを提示している。

	By separating type index terms from programs, we make it both natural and straightforward to accommodate dependent types in the presence of realistic programming features such as (general) recursion and effects (e.g., exceptions and references).

	In addition, we have formally established the type soundness of λΠ,Σ pat , the core dependent type system in our development, and have also justified the correctness of a set of elaboration rules, which play a crucial role in reducing (not eliminating) the amount of explicit type annotation needed in practice.

	プログラムからタイプインデックス用語を分離することで、我々はそれが自然とそのような（一般）再帰と効果（例えば、例外および参照）のような現実的なプログラミング機能の存在下で依存型に対応するために簡単な両方作る。

	さらに、我々は正式にλΠ 、 Σパット、私たちの開発の中核依存型システムのタイプの健全性を確立している、とも（しない排除する）減らすのに重要な役割を果たして推敲ルールのセット、の正しさを正当化している実際に必要な明示的な型注釈の量。

	On another front, we have finished a prototype implementation of Dependent ML (DML), which essentially extends ML with a restricted form of dependent types such that the type index terms are required to be integer expressions drawn from the type index language Lint presented in Section 3. 

	A variety of programming examples have been constructed in support of the practicality of DML, some of which are shown in Section 7.

	Lastly, we point out that λΠ,Σ pat can be classified as an applied type system in the framework ATS (Xi, 2004).

	At this moment, DML has already been fully incorporated into ATS (Xi, 2005).

	別の面では、本質的に依存型の制限された形でMLを拡張依存ML （ DML） 、のプロトタイプ実装を終えたようなタイプの索引語は、セクションで提示タイプインデックス言語リントから引き出された整数表現であることが要求されていることを3 。

	プログラミングの例の様々なセクション7に示されているそのうちのいくつかのDML 、の実用性をサポートするために構築されている。

	最後に、私たちはλΠ 、 ΣのパットがフレームワークATS （XI 、 2004）で適用された型システムに分類することができると指摘している。

	この時点で、 DMLは、すでに完全にATS （西、 2005 ）に組み込まれている。

	Acknowledgments The current paper is partly based on the author’s doctoral dissertation (Xi, 1998) supervised by Frank Pfenning, and an extended abstract of the dissertation is already in publication (Xi & Pfenning, 1999).

	The author sincerely thanks Frank Pfenning for his suggestion of the research topic and his guidance in the research conducted subsequently.

	In addition, the author acknowledges many discussions with Chiyan Chen regarding the subject of elaboration presented in Section 5 and thanks him for his efforts on proofreading a draft of paper.
	
	Also, the author thanks the anonymous referees for their voluminous constructive comments, which have undoubtedly raised the quality of the paper significantly.

	一部は著者の博士論文フランクプフェニング監修（XI 、 1998） 、および論文のアブストラクトに現在の紙ベースと謝辞は、出版物（XI ＆プフェニング、 1999）に既にある。

	研究テーマの彼の提案とその後に行われた研究での彼の指導のために著者心から感謝フランクプフェニング。

	また、著者は論文の草稿を校正上の彼の努力については、セクション5と感謝彼に提示精緻化の主題に関するChiyanチェンとの多くの議論を認めるものです。

	また、著者のおかげで持っている彼らの膨大な建設的なコメントの匿名レフェリーは、間違いなく大幅に紙の質を上げた。

- References

	Andrews, Peter B. (1972). General Models, Descriptions and Choice in Type Theory.
	Journal of symbolic logic, 37, 385–394.
	Andrews, Peter B. (1986). An Introduction to Mathematical Logic: To Truth through Proof.
	Orlando, Florida: Academic Press, Inc.
	Augustsson, Lennart. (1998). Cayenne – a language with dependent types. Pages 239–250
	of: Proceedings of the 3rd acm sigplan international conference on functional programming.
	Barendregt, Hendrik Pieter. (1984). The lambda calculus, its syntax and semantics. Revised
	edition edn. Studies in Logic and the Foundations of Mathematics, vol. 103.
	Amsterdam: North-Holland.
	Barendregt, Hendrik Pieter. (1992). Lambda Calculi with Types. Pages 117–441 of:
	Abramsky, S., Gabbay, Dov M., & Maibaum, T.S.E. (eds), Handbook of logic in computer
	science, vol. II. Oxford: Clarendon Press.
	Chen, Chiyan, & Xi, Hongwei. 2003 (June). Implementing Typeful Program Transformations.
	Pages 20–28 of: Proceedings of acm sigplan workshop on partial evaluation and
	semantics based program manipulation.
	Chen, Chiyan, & Xi, Hongwei. 2005a (September). Combining Programming with Theorem
	Proving. Pages 66–77 of: Proceedings of the tenth acm sigplan international conference
	on functional programming.
	Chen, Chiyan, & Xi, Hongwei. (2005b). Meta-Programming through Typeful Code Representation.
	Journal of functional programming, 15(6), 1–39.
	Chen, Chiyan, Shi, Rui, & Xi, Hongwei. (2005). Implementing Typeful Program Transformations.
	Fundamenta informaticae, 69(1-2), 103–121.
	Cheney, James, & Hinze, Ralf. (2003). Phantom Types. Technical Report CUCIS-TR2003-
	1901. Cornell University. Available at
	http://techreports.library.cornell.edu:8081/
	Dienst/UI/1.0/Display/cul.cis/TR2003-1901.
	Church, Alonzo. (1940). A formulation of the simple type theory of types. Journal of
	Symbolic Logic, 5, 56–68.
	Constable, Robert L., et al. . (1986). Implementing mathematics with the NuPrl proof
	development system. Englewood Cliffs, New Jersey: Prentice-Hall.
	Dantzig, G.B., & Eaves, B.C. (1973). Fourier-Motzkin elimination and its dual. Journal
	of combinatorial theory (a), 14, 288–297.
	Danvy, Olivier. (1998). Functional unparsing. Journal of functional programming, 8(6),
	621–625.
	Dowek, Gilles, Felty, Amy, Herbelin, Hugo, Huet, G´erard, Murthy, Chet, Parent, Catherine,
	Paulin-Mohring, Christine, & Werner, Benjamin. (1993). The Coq proof assistant
	user’s guide. Rapport Technique 154. INRIA, Rocquencourt, France. Version 5.8.
	Dunfield, Joshua. 2002 (Sept.). Combining two forms of type refinement. Tech. rept.
	CMU-CS-02-182. Carnegie Mellon University.
	Dunfield, Joshua, & Pfenning, Frank. (2003). Type assignment for intersections and unions
	in call-by-value languages. Pages 250–266 of: Gordon, A.D. (ed), Proceedings of the 6th
	international conference on foundations of software science and computation structures
	(fossacs’03). Warsaw, Poland: Springer-Verlag LNCS 2620.
	Dunfield, Joshua, & Pfenning, Frank. (2004). Tridirectional typechecking. Pages 281–
	292 of: X.Leroy (ed), Conference record of the 31st annual symposium on principles of
	programming languages (popl’04). Venice, Italy: ACM Press. Extended version available
	as Technical Report CMU-CS-04-117, March 2004.
	Freeman, Tim, & Pfenning, Frank. (1991). Refinement types for ML. Pages 268–277 of:
	Acm sigplan conference on programming language design and implementation.
	Girard, Jean-Yves. 1972 (June). Interpr´etation fonctionnelle et Elimination ´ des coupures
	dans l’arithm´etique d’ordre sup´erieur. Th`ese de doctorat d’´etat, Universit´e de Paris VII,
	Paris, France.
	Griffin, Timothy. 1990 (January). A Formulae-as-Types Notion of Control. Pages 47–58 of:
	Conference record of popl ’90: 17th acm sigplan symposium on principles of programming
	languages.
	Harper, Robert. (1994). A simplified account of polymorphic references. Information
	processing letters, 51, 201–206.
	Hayashi, Susumu, & Nakano, Hiroshi. (1988). PX: A computational logic. The MIT Press.
	Henkin, Leon. (1950). Completeness in the theory of types. Journal of symbolic logic, 15,
	81–91.
	Hinze, Ralf. (2001). Manufacturing Datatypes. Journal of Functional Programming, 11(5),
	493–524.
	Hughes, John, Pareto, Lars, & Sabry, Amr. (1996). Proving the Correctness of Reactive
	Systems Using Sized Types. Pages 410–423 of: Proceeding of 23rd annual acm sigplan
	symposium on principles of programming languages (popl ’96).
	INRIA. Objective Caml. http://caml.inria.fr.
	Jay, C.B., & Sekanina, M. (1996). Shape checking of array programs. Tech. rept. 96.09.
	University of Technology, Sydney, Australia.
	Jones, Simon Peyton, Vytiniotis, Dimitrios, Weirich, Stephanie, & Washburn, Geoffrey.
	2005 (November). Simple unification-based type inference for gadts.
	Kahrs, Stefan. (2001). Red-black trees with types. Journal of functional programming,
	11(4), 425–432.
	Kreitz, Christoph, Hayden, Mark, & Hickey, Jason. (1998). A proof environment for the
	development of group communication systems. Pages 317–332 of: Kirchner, Hlne, &
	Kirchner, Claude (eds), 15th international conference on automated deduction. LNAI
	1421. Lindau, Germany: Springer-Verlag.
	Martin-L¨of, Per. (1984). Intuitionistic type theory. Naples, Italy: Bibliopolis.
	Martin-L¨of, Per. (1985). Constructive mathematics and computer programming. Hoare,
	C. R. A. (ed), Mathematical logic and programming languages. Prentice-Hall.
	McBride, Conor. Epigram. Available at:
	http://www.dur.ac.uk/CARG/epigram.
	Meyer, Albert, & Wand, Mitchell. (1985). Continuation Semantics in Typed Lambda
	Calculi (summary). Pages 219–224 of: Parikh, Rohit (ed), Logics of programs. SpringerVerlag
	LNCS 224.
	Michaylov, S. 1992 (August). Design and implementation of practical constraint logic
	programming systems. Ph.D. thesis, Carnegie Mellon University. Available as Technical
	Report CMU-CS-92-168.
	Milner, Robin, Tofte, Mads, Harper, Robert W., & MacQueen, D. (1997). The definition
	of standard ml (revised). Cambridge, Massachusetts: MIT Press.
	Mitchell, John C., & Plotkin, Gordon D. (1988). Abstract types have existential type.
	Acm transactions on programming languages and systems, 10(3), 470–502.
	Mitchell, John C., & Scott, Philip J. (1989). Typed lambda models and cartesian closed
	categories (preliminary version). Pages 301–316 of: Gray, John W., & Scedrov, Andre
	(eds), Categories in computer science and logic. Contemporary Mathematics, vol. 92.
	Boulder, Colorado: American Mathematical Society.
	Odersky, Martin, Zenger, Christoph, & Zenger, Matthias. (2001). Colored Local Type
	Inference. Pages 41–53 of: Proceedings of the 28th annual acm sigplan-sigact symposium
	on principles of programming languages.
	Okasaki, Chris. (1998). Purely Functional Data Structures. Cambridge University Press.
	Owre, S., Rajan, S., Rushby, J.M., Shankar, N., & Srivas, M.K. (1996). PVS: Combining
	specification, proof checking, and model checking. Pages 411–414 of: Alur, Rajeev,
	& Henzinger, Thomas A. (eds), Proceedings of the 8th international conference on
	computer-aided verification (cav ’96). New Brunswick, NJ: Springer-Verlag LNCS 1102.
	Parent, Catherine. (1995). Synthesizing proofs from programs in the calculus of inductive
	constructions. Pages 351–379 of: Proceedings of the international conference on
	mathematics for programs constructions. Springer-Verlag LNCS 947.
	Peyton Jones, Simon, et al. . 1999 (Feb.). Haskell 98 – A non-strict, purely functional
	language. Available at
	http://www.haskell.org/onlinereport/.
	Pfenning, Frank. Computation and Deduction. Cambridge University Press. (to appear).
	Pfenning, Frank, & Elliott, Conal. 1988 (June). Higher-order abstract syntax. Pages 199–
	208 of: Proceedings of the ACM SIGPLAN ’88 Symposium on Language Design and
	Implementation.
	Pierce, B., & Turner, D. (1998). Local type inference. Pages 252–265 of: Proceedings of
	25th annual acm sigplan symposium on principles of programming languages (popl ’98).
	Pottier, Franois, & R´egis-Gianas, Yann. 2006 (Jan.). Stratified type inference for generalized
	algebraic data types. Pages 232–244 of: Proceedings of the 33rd ACM symposium
	on principles of programming languages (popl’06).
	Pugh, W., & Wonnacott, D. (1992). Eliminating false data dependences using the Omega
	test. Pages 140–151 of: Acm sigplan ’92 conference on programming language design
	and implementation. ACM Press.
	Pugh, W., & Wonnacott, D. 1994 (November). Experience with constraint-based array
	dependence analysis. Tech. rept. CS-TR-3371. University of Maryland.
	Sannella, D., & Tarlecki, A. 1989 (February). Toward formal development of ML programs:
	Foundations and methodology. Tech. rept. ECS-LFCS-89-71. Laboratory for
	Foundations of Computer Science, Department of Computer Science, University of Edinburgh.
	Sheard, Tim. (2004). Languages of the future. Proceedings of the onward! track of objectedoriented
	programming systems, languages, applications (oopsla). Vancouver, BC: ACM
	Press.
	Shostak, Robert E. (1977). On the SUP-INF method for proving Presburger formulas.
	Journal of the acm, 24(4), 529–543.
	Sulzmann, M., Odersky, M., & Wehr, M. (1997). Type inference with constrained types.
	Proceedings of 4th international workshop on foundations of object-oriented languages.
	Takahashi, M. (1995). Parallel Reduction. Information and computation, 118, 120–127.
	Westbrook, Edwin, Stump, Aaron, & Wehrman, Ian. 2005 (September). A LanguageBased
	Approach to Functionally Correct Imperative Programming. Pages 268–279 of:
	Proceedings of the tenth acm sigplan international conference on functional programming.
	Wright, Andrew. (1995). Simple imperative polymorphism. Journal of Lisp and Symbolic
	Computation, 8(4), 343–355.
	Xi, Hongwei. (1998). Dependent types in practical programming. Ph.D. thesis, Carnegie
	Mellon University. pp. viii+189. Available at
	http://www.cs.cmu.edu/~hwxi/DML/thesis.ps.
	Xi, Hongwei. 1999 (September). Dependently Typed Data Structures. Pages 17–33 of:
	Proceedings of workshop on algorithmic aspects of advanced programming languages.
	Xi, Hongwei. (2003). Dependently Typed Pattern Matching. Journal of universal computer
	science, 9(8), 851–872.
	Xi, Hongwei. (2004). Applied Type System (extended abstract). Pages 394–408 of: postworkshop
	proceedings of types 2003. Springer-Verlag LNCS 3085.
	Xi, Hongwei. (2005). Applied Type System. Available at:
	http://www.cs.bu.edu/~hwxi/ATS.
	Xi, Hongwei, & Pfenning, Frank. 1998 (June). Eliminating array bound checking through
	dependent types. Pages 249–257 of: Proceedings of acm sigplan conference on programming
	language design and implementation.
	Xi, Hongwei, & Pfenning, Frank. (1999). Dependent Types in Practical Programming.
	Pages 214–227 of: Proceedings of 26th acm sigplan symposium on principles of programming
	languages. San Antonio, Texas: ACM press.
	Xi, Hongwei, Chen, Chiyan, & Chen, Gang. (2003). Guarded Recursive Datatype Constructors.
	Pages 224–235 of: Proceedings of the 30th ACM SIGPLAN Symposium on
	Principles of Programming Languages. New Orleans, LA: ACM press.
	Zenger, Christoph. (1997). Indexed types. Theoretical computer science, 187, 147–165.
	Zenger, Christoph. (1998). Indizierte typen. Ph.D. thesis, Fakult¨at fur ¨ Informatik, Universit¨at
	Karlsruhe.

		xf ,→ g xf
		e ,→ g e
		0
		c(e) ,→ g c(e
		0
		) hi ,→ g hi
		e1 ,→ g e
		0
		1 e2 ,→ g e
		0
		2
		<e1, e2> ,→ g he
		0
		1, e
		0
		2i
		e ,→ g e
		0
		fst(e) ,→ g fst(e
		0
		)
		e ,→ g e
		0
		snd(e) ,→ g snd(e
		0
		)
		e ,→ g e
		0 ms ,→ g ms0
		case e of ms ,→ g case e
		0 of ms0
		e ,→ g e
		0
		lamx. e ,→ g lamx. e
		0
		e1 ,→ g e
		0
		1 e2 ,→ g e
		0
		2
		e1(e2) ,→ g e
		0
		1(e
		0
		2)
		e ,→ g e
		0
		fix f. e ,→ g fix f. e
		0
		e1 ,→ g e
		0
		1 e2 ,→ g e
		0
		2
		let x = e1 in e2 end ,→ g let x = e
		0
		1 in e
		0
		2 end
		v1 ,→ g v
		0
		1
		fst(<v1, v2>) ,→ g v
		0
		1
		v2 ,→ g v
		0
		2
		snd(<v1, v2>) ,→ g v
		0
		2
		e ,→ g e
		0
		v ,→ g v
		0
		(lamx. e)(v) ,→ g e
		0
		[x 7→ v
		0
		]
		e ,→ g e
		0
		fix f. e ,→ g e
		0
		[f 7→ fix f. e
		0
		]
		e ,→ g e
		0
		v ,→ g v
		0
		let x = v in e end ,→ g e
		0
		[x 7→ v
		0
		]
		match(v, pk) ⇒ θ ek ,→ g e
		0
		k θ ,→ g θ
		0
		case v of (p1 ⇒ e1 | · · · | pn ⇒ en) ,→ g e
		0
		k[θ
		0
		]
		x 6∈ FV(E) e ,→ g e
		0 E ,→ g E
		0
		let x = e in E[x] end ,→ g E
		0
		[e
		0
		]
		v ,→ g v
		0
		hfst(v), snd(v)i ,→ g v
		0
		v ,→ g v
		0
		lamx. v(x) ,→ g v
		0
		[] ,→ g []
		E ,→ g E
		0
		c(E) ,→ g c(E
		0
		)
		E ,→ g E
		0
		e ,→ g e
		0
		hE, ei ,→ g hE
		0
		, e
		0
		i
		v ,→ g v
		0 E ,→ g E
		0
		hv, Ei ,→ g hv
		0
		, E
		0
		i
		E ,→ g E
		0
		fst(E) ,→ g fst(E
		0
		)
		E ,→ g E
		0
		snd(E) ,→ g snd(E
		0
		)
		E ,→ g E
		0 ms ,→ g ms0
		case E of ms ,→ g case E
		0 of ms0
		E ,→ g E
		0
		e ,→ g e
		0
		E(e) ,→ g E
		0
		(e
		0
		)
		v ,→ g v
		0 E ,→ g E
		0
		v(E) ,→ g v
		0
		(E
		0
		)
		E ,→ g E
		0
		e ,→ g e
		0
		let x = E in e end ,→ g let x = E
		0
		in e
		0
		end
		e1 ,→ g e
		0
		1 · · · en ,→ g e
		0
		n
		(p1 ⇒ e1 | · · · | pn ⇒ en) ,→ g (p1 ⇒ e
		0
		1 | · · · | pn ⇒ e
		0
		n)
		θ(xf ) ,→ g θ
		0
		(xf ) for each xf in dom(θ) = dom(θ
		0
		)
		θ ,→ g θ
		0

	Fig. A 1. The rules for the parallel general reduction ,→ g
